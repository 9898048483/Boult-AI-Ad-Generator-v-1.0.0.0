#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs';
import path from 'path';
import Replicate from 'replicate';
import { GoogleGenAI } from '@google/genai';

const program = new Command();

program
  .name('boult-ai-ad')
  .description(chalk.bold.yellow('⚡ BOULT AI Ad Generator Suite CLI') + ' - Generate high-converting commercial ad creative from the terminal')
  .version('1.0.0');

// Generate Single Ad Command
program
  .command('generate')
  .description('Generate a high-resolution commercial product ad image')
  .requiredOption('-p, --prompt <string>', 'Ad description prompt')
  .option('-a, --aspect <ratio>', 'Aspect ratio (1:1, 16:9, 9:16, 4:3)', '1:1')
  .option('-m, --mode <mode>', 'AI Engine Mode (auto, replicate, gemini)', 'auto')
  .option('-o, --output <path>', 'Output file or directory path', './boult-ad.png')
  .option('--replicate-token <token>', 'Replicate API Token')
  .option('--gemini-key <key>', 'Gemini API Key')
  .action(async (options) => {
    console.log(chalk.bold.cyan('\n⚡ BOULT AI Ad Generator CLI'));
    console.log(chalk.gray(`Prompt: "${options.prompt}"`));
    console.log(chalk.gray(`Aspect Ratio: ${options.aspect} | Mode: ${options.mode}\n`));

    const spinner = ora('Initializing AI Generation Engine...').start();

    const repToken = options.replicateToken || process.env.REPLICATE_API_TOKEN;
    const gemKey = options.geminiKey || process.env.GEMINI_API_KEY;

    if (!repToken && !gemKey) {
      spinner.fail(chalk.red('Authentication Error: Missing API Credentials!'));
      console.log(chalk.yellow('Please set REPLICATE_API_TOKEN or GEMINI_API_KEY in your environment variables.'));
      process.exit(1);
    }

    try {
      let imageUrl = null;
      let provider = null;

      // Primary: Replicate (Flux Schnell)
      if (repToken && (options.mode === 'replicate' || options.mode === 'auto')) {
        spinner.text = chalk.amber ? chalk.amber('Routing request to Replicate (Flux Schnell)...') : 'Routing request to Replicate (Flux Schnell)...';
        const replicate = new Replicate({ auth: repToken });
        const output = await replicate.run('black-forest-labs/flux-schnell', {
          input: {
            prompt: `Commercial product advertising photo: ${options.prompt}, 8k, cinematic studio lighting`,
            aspect_ratio: options.aspect,
            output_format: 'png',
          },
        });
        imageUrl = Array.isArray(output) ? output[0] : output;
        provider = 'Replicate (Flux Schnell)';
      }

      // Fallback: Gemini Flash Image
      if (!imageUrl && gemKey && (options.mode === 'gemini' || options.mode === 'auto')) {
        spinner.text = 'Fallback: Routing to Gemini Flash Image...';
        const ai = new GoogleGenAI({ apiKey: gemKey });
        const response = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite-image',
          contents: { parts: [{ text: `${options.prompt}, commercial product photography, 8k resolution` }] },
          config: {
            imageConfig: {
              aspectRatio: options.aspect === '16:9' ? '16:9' : options.aspect === '9:16' ? '9:16' : options.aspect === '4:3' ? '4:3' : '1:1',
            },
          },
        });

        const parts = response.candidates?.[0]?.content?.parts || [];
        for (const part of parts) {
          if (part.inlineData?.data) {
            const buffer = Buffer.from(part.inlineData.data, 'base64');
            let outPath = options.output;
            if (!outPath.endsWith('.png') && !outPath.endsWith('.jpg')) {
              if (!fs.existsSync(outPath)) fs.mkdirSync(outPath, { recursive: true });
              outPath = path.join(outPath, `boult_ad_${Date.now()}.png`);
            }
            fs.writeFileSync(outPath, buffer);
            spinner.succeed(chalk.green(`Ad creative successfully generated & saved to ${chalk.bold(outPath)}`));
            console.log(chalk.dim(`[Engine: Gemini (Flash Image) | Aspect: ${options.aspect}]`));
            return;
          }
        }
      }

      if (imageUrl) {
        spinner.text = 'Downloading rendered asset...';
        const res = await fetch(String(imageUrl));
        const arrayBuffer = await res.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        let outPath = options.output;
        if (!outPath.endsWith('.png') && !outPath.endsWith('.jpg') && !outPath.endsWith('.webp')) {
          if (!fs.existsSync(outPath)) fs.mkdirSync(outPath, { recursive: true });
          outPath = path.join(outPath, `boult_ad_${Date.now()}.png`);
        } else {
          const dir = path.dirname(outPath);
          if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(outPath, buffer);
        spinner.succeed(chalk.green(`Ad creative successfully generated & saved to ${chalk.bold(outPath)}`));
        console.log(chalk.dim(`[Engine: ${provider} | Aspect: ${options.aspect}]`));
      } else {
        spinner.fail(chalk.red('Generation failed: Unable to render output from available providers.'));
      }
    } catch (err) {
      spinner.fail(chalk.red(`Generation Error: ${err.message || err}`));
      process.exit(1);
    }
  });

// Multi-Threaded Concurrent Batch Command
program
  .command('batch')
  .description('Generate 5 concurrent ad variations simultaneously in parallel')
  .requiredOption('-p, --prompt <string>', 'Base product ad description prompt')
  .option('-c, --count <number>', 'Number of concurrent variations to render', '5')
  .option('-a, --aspect <ratio>', 'Aspect ratio (1:1, 16:9, 9:16, 4:3)', '1:1')
  .option('-o, --outdir <path>', 'Output directory', './boult-batch-ads')
  .action(async (options) => {
    const count = parseInt(options.count) || 5;
    console.log(chalk.bold.yellow(`\n🚀 Starting Multi-Threaded Batch Rendering (${count} concurrent ad variations)...`));
    console.log(chalk.gray(`Base Prompt: "${options.prompt}"`));
    console.log(chalk.gray(`Output Directory: ${options.outdir}\n`));

    if (!fs.existsSync(options.outdir)) {
      fs.mkdirSync(options.outdir, { recursive: true });
    }

    const repToken = process.env.REPLICATE_API_TOKEN;
    const gemKey = process.env.GEMINI_API_KEY;

    if (!repToken && !gemKey) {
      console.log(chalk.red('❌ Authentication Error: Missing API Credentials! Set REPLICATE_API_TOKEN or GEMINI_API_KEY.'));
      process.exit(1);
    }

    const styleVariations = [
      'cinematic studio lighting, dark luxury background, floating water droplets',
      'vibrant neon cyber lighting, reflective surface, high energy commercial',
      'minimalist pastel background, soft studio shadows, elegant modern design',
      'dramatic spotlight, premium gold accents, sleek product showcase',
      'action sport outdoor backdrop, sun flared lighting, ultra sharp focus'
    ];

    const spinner = ora(`Rendering ${count} ad variations concurrently...`).start();

    try {
      const renderPromises = Array.from({ length: count }).map(async (_, idx) => {
        const style = styleVariations[idx % styleVariations.length];
        const fullPrompt = `${options.prompt}, ${style}, 8k commercial photo`;
        const outFile = path.join(options.outdir, `boult_ad_variation_${idx + 1}.png`);

        if (repToken) {
          const replicate = new Replicate({ auth: repToken });
          const output = await replicate.run('black-forest-labs/flux-schnell', {
            input: { prompt: fullPrompt, aspect_ratio: options.aspect, output_format: 'png' }
          });
          const url = Array.isArray(output) ? output[0] : output;
          const res = await fetch(String(url));
          const buffer = Buffer.from(await res.arrayBuffer());
          fs.writeFileSync(outFile, buffer);
          return { id: idx + 1, file: outFile, success: true };
        } else if (gemKey) {
          const ai = new GoogleGenAI({ apiKey: gemKey });
          const response = await ai.models.generateContent({
            model: 'gemini-3.1-flash-lite-image',
            contents: { parts: [{ text: fullPrompt }] },
            config: {
              imageConfig: {
                aspectRatio: options.aspect === '16:9' ? '16:9' : options.aspect === '9:16' ? '9:16' : options.aspect === '4:3' ? '4:3' : '1:1',
              }
            }
          });
          const parts = response.candidates?.[0]?.content?.parts || [];
          for (const part of parts) {
            if (part.inlineData?.data) {
              const buffer = Buffer.from(part.inlineData.data, 'base64');
              fs.writeFileSync(outFile, buffer);
              return { id: idx + 1, file: outFile, success: true };
            }
          }
        }
        return { id: idx + 1, file: outFile, success: false };
      });

      const results = await Promise.all(renderPromises);
      const successful = results.filter(r => r.success);

      spinner.succeed(chalk.green(`Batch complete! ${successful.length}/${count} ad variations generated successfully.`));
      console.log(chalk.cyan(`\nGenerated files saved in ${options.outdir}:`));
      results.forEach(r => {
        if (r.success) {
          console.log(chalk.dim(` - Variation #${r.id}: ${r.file}`));
        }
      });
    } catch (err) {
      spinner.fail(chalk.red(`Batch execution error: ${err.message || err}`));
    }
  });

program.parse(process.argv);
