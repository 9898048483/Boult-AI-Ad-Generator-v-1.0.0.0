#!/usr/bin/env python3
"""
BOULT Interactive Ad Generator CLI Architect Tool
Powered by python-prompt-toolkit and local BOULT AI Engine server
"""

import os
import sys
import json
import time
import requests
from pathlib import Path

from prompt_toolkit import PromptSession
from prompt_toolkit.history import FileHistory
from prompt_toolkit.completion import WordCompleter, FuzzyCompleter
from prompt_toolkit.formatted_text import HTML
from prompt_toolkit.shortcuts import radiolist_dialog, message_dialog
from prompt_toolkit.styles import Style

# Server Configuration
DEFAULT_SERVER_URL = os.environ.get("BOULT_SERVER_URL", "http://localhost:3000")
HISTORY_FILE = Path.home() / ".boult_history"

# Available Models
MODELS = [
    ("gemini-3.1-flash-lite-image", "Gemini 3.1 Flash Lite (Fast Studio Engine)"),
    ("gemini-2.5-flash", "Gemini 2.5 Flash (Commercial High Quality)"),
    ("flux-schnell", "Replicate Flux Schnell (Ultra Photorealistic)"),
    ("pollinations-free", "Pollinations Free AI (Flux Unfiltered Engine)"),
    ("studio-svg-fallback", "BOULT Offline Vector Studio (Instant SVG)"),
]

# Available Aspect Ratios
ASPECT_RATIOS = [
    ("1:1", "Square (Instagram Post / Product Catalog)"),
    ("16:9", "Landscape (YouTube / Desktop Billboard)"),
    ("9:16", "Portrait (TikTok / Instagram Reel / Story)"),
    ("4:3", "Standard (Print / Digital Display)"),
]

# Custom prompt-toolkit style
CLI_STYLE = Style.from_dict({
    "prompt": "ansicayan bold",
    "prompt-tag": "ansiyellow bold",
    "info": "ansigreen",
    "warning": "ansiyellow",
    "error": "ansired bold",
    "url": "ansicyan underline",
    "header": "ansimagenta bold",
    "meta": "ansigray",
})


class BoultCLI:
    def __init__(self, server_url=DEFAULT_SERVER_URL):
        self.server_url = server_url.rstrip("/")
        self.aspect_ratio = "1:1"
        self.model = "gemini-3.1-flash-lite-image"
        self.history = FileHistory(str(HISTORY_FILE))
        
        # Build completers for quick model/aspect auto-completions
        self.command_completer = WordCompleter(
            [
                "/generate",
                "/aspect",
                "/model",
                "/enhance",
                "/config",
                "/preset",
                "/help",
                "/exit",
                "1:1",
                "16:9",
                "9:16",
                "4:3",
            ] + [m[0] for m in MODELS],
            ignore_case=True,
            sentence=True,
        )

        self.session = PromptSession(
            history=self.history,
            completer=self.command_completer,
            style=CLI_STYLE,
        )

    def print_banner(self):
        print("\033[2J\033[H", end="")  # Clear screen
        banner = HTML(
            "<header>====================================================================</header>\n"
            "<header>⚡ BOULT AI AD GENERATOR — INTERACTIVE PYTHON CLI ARCHITECT</header>\n"
            "<header>====================================================================</header>\n"
            "<b>Server:</b> <url>{url}</url> | <b>Model:</b> <prompt-tag>{model}</prompt-tag> | <b>Aspect:</b> <prompt-tag>{aspect}</prompt-tag>\n"
            "<i>Type your ad prompt directly, or use commands like <info>/model</info>, <info>/aspect</info>, <info>/enhance</info>, <info>/help</info>, <info>/exit</info>.</i>\n"
            "<i>(For multi-line prompts: press Alt+Enter or Esc+Enter)</i>\n"
        ).format(
            url=self.server_url,
            model=self.model,
            aspect=self.aspect_ratio,
        )
        print(self.format_html(banner))

    def format_html(self, text_html):
        from prompt_toolkit.formatted_text import to_formatted_text
        from prompt_toolkit.output import ColorDepth
        from prompt_toolkit.shortcuts import print_formatted_text
        return print_formatted_text(text_html, style=CLI_STYLE)

    def check_health(self):
        try:
            r = requests.get(f"{self.server_url}/api/config", timeout=3)
            if r.status_code == 200:
                data = r.json()
                print(HTML("<info>✓ Server connection active:</info> {}").format(json.dumps(data, indent=2)))
                return True
            else:
                print(HTML("<warning>⚠ Server returned status code {}</warning>").format(r.status_code))
                return False
        except Exception as e:
            print(HTML("<error>✗ Cannot connect to server at {}: {}</error>").format(self.server_url, e))
            print(HTML("<warning>Ensure your Node/Express server is running on port 3000!</warning>"))
            return False

    def display_config(self):
        print(HTML("<header>--- Current BOULT CLI Configuration ---</header>"))
        print(HTML("<b>Target API URL:</b> <url>{}</url>").format(self.server_url))
        print(HTML("<b>Active AI Model:</b> <prompt-tag>{}</prompt-tag>").format(self.model))
        print(HTML("<b>Current Aspect Ratio:</b> <prompt-tag>{}</prompt-tag>").format(self.aspect_ratio))
        print(HTML("<b>History File:</b> {}").format(HISTORY_FILE))
        print(HTML("<info>Checking server connection status...</info>"))
        self.check_health()

    def select_aspect_ratio_dialog(self):
        """Interactive dropdown dialog for selecting aspect ratio using prompt-toolkit."""
        result = radiolist_dialog(
            title="Select Aspect Ratio",
            text="Choose the desired image aspect ratio for your advertisement:",
            values=ASPECT_RATIOS,
            default=self.aspect_ratio,
        ).run()
        if result:
            self.aspect_ratio = result
            print(HTML("<info>✓ Aspect ratio set to:</info> <prompt-tag>{}</prompt-tag>").format(self.aspect_ratio))

    def select_model_dialog(self):
        """Interactive dropdown dialog for selecting model using prompt-toolkit."""
        result = radiolist_dialog(
            title="Select AI Model Engine",
            text="Choose the AI model engine for image generation:",
            values=MODELS,
            default=self.model,
        ).run()
        if result:
            self.model = result
            print(HTML("<info>✓ AI Model set to:</info> <prompt-tag>{}</prompt-tag>").format(self.model))

    def enhance_prompt(self, raw_prompt):
        print(HTML("<info>⚡ Enhancing prompt via Gemini creative director...</info>"))
        try:
            resp = requests.post(
                f"{self.server_url}/api/enhance-prompt",
                json={"prompt": raw_prompt},
                headers={"Content-Type": "application/json"},
                timeout=12,
            )
            if resp.status_code == 200:
                enhanced = resp.json().get("enhancedPrompt", raw_prompt)
                print(HTML("<header>--- Enhanced Ad Prompt ---</header>"))
                print(HTML("<b>{}</b>\n").format(enhanced))
                return enhanced
            else:
                print(HTML("<warning>Enhance API returned status {}. Using raw prompt.</warning>").format(resp.status_code))
                return raw_prompt
        except Exception as e:
            print(HTML("<warning>Enhance failed ({}). Using raw prompt.</warning>").format(e))
            return raw_prompt

    def generate_ad(self, prompt_text):
        if not prompt_text.strip():
            print(HTML("<error>Prompt cannot be empty!</error>"))
            return

        print(HTML("\n<info>🚀 Sending ad generation request...</info>"))
        print(HTML("<b>Prompt:</b> {}").format(prompt_text))
        print(HTML("<b>Aspect Ratio:</b> {} | <b>Model:</b> {}").format(self.aspect_ratio, self.model))

        start_time = time.time()
        try:
            payload = {
                "prompt": prompt_text,
                "aspectRatio": self.aspect_ratio,
                "selectedModel": self.model,
            }
            resp = requests.post(
                f"{self.server_url}/api/generate-ad",
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=60,
            )
            elapsed = time.time() - start_time

            if resp.status_code == 200:
                data = resp.json()
                print(HTML("\n<header>==================================================</header>"))
                print(HTML("<info>✨ AD GENERATED SUCCESSFULLY ({:.2f}s)</info>").format(elapsed))
                print(HTML("<header>==================================================</header>"))
                print(HTML("<b>Provider:</b> <prompt-tag>{}</prompt-tag>").format(data.get("provider", "Unknown")))
                print(HTML("<b>Status:</b> {}").format(data.get("status", "success")))
                print(HTML("<b>Image URL:</b> <url>{}</url>").format(data.get("imageUrl", "N/A")))
                
                if data.get("isFallback"):
                    print(HTML("<warning><b>Notice (Fallback Active):</b> {}</warning>").format(data.get("fallbackReason", "")))
                
                if data.get("notice"):
                    print(HTML("<i>Note: {}</i>").format(data.get("notice")))

                print(HTML("<header>--------------------------------------------------</header>\n"))
            else:
                print(HTML("<error>❌ Server Error ({}): {}</error>").format(resp.status_code, resp.text))

        except Exception as e:
            print(HTML("<error>❌ HTTP Request Failed: {}</error>").format(e))

    def show_help(self):
        help_text = HTML(
            "<header>--- BOULT CLI Commands ---</header>\n"
            "• <b>&lt;your prompt text&gt;</b> : Direct ad prompt submission to generation engine\n"
            "• <b>/aspect</b>             : Select image aspect ratio (1:1, 16:9, 9:16, 4:3) via interactive dropdown\n"
            "• <b>/model</b>              : Select AI model engine via interactive dropdown\n"
            "• <b>/enhance &lt;prompt&gt;</b>    : Enhance prompt using Gemini Creative Director\n"
            "• <b>/config</b>             : Check server connectivity and configuration\n"
            "• <b>/preset</b>             : Load preset commercial prompt examples\n"
            "• <b>/help</b>               : Show this help message\n"
            "• <b>/exit</b> or <b>exit</b>        : Exit the CLI application\n"
        )
        print(self.format_html(help_text))

    def select_preset(self):
        presets = [
            ("BOULT Crown smartwatch on sleek dark metallic podium with glowing cyan neon rim light, studio advertisement", "Smartwatch High-Tech Ad"),
            ("BOULT Drift ANC Wireless Earphones floating over glossy black water with subtle liquid ripples and golden key light", "Earphones Liquid Reflection Ad"),
            ("A luxury wireless speaker surrounded by tropical palm shadows and warm golden hour sunset beam, 8k resolution", "Speaker Summer Vibe Ad"),
            ("Cyberpunk street scene with futuristic BOULT neon headphones displayed inside crystal glass showcase, 4k cinematic", "Cyberpunk Neon Headphone Ad"),
        ]
        result = radiolist_dialog(
            title="Select Preset Commercial Prompt",
            text="Choose a pre-made high quality prompt to test:",
            values=[(p[0], p[1]) for p in presets],
        ).run()
        if result:
            print(HTML("<info>Preset selected!</info>"))
            self.generate_ad(result)

    def run(self):
        self.print_banner()
        self.check_health()

        while True:
            try:
                # Interactive prompt session with history and completions
                prompt_label = HTML(
                    "<prompt>BOULT-AI</prompt> [<prompt-tag>{}</prompt-tag>|<prompt-tag>{}</prompt-tag>]❯ "
                ).format(self.model.split("-")[0], self.aspect_ratio)

                user_input = self.session.prompt(
                    prompt_label,
                    multiline=False,
                ).strip()

                if not user_input:
                    continue

                # Command parsing
                cmd_lower = user_input.lower()
                if cmd_lower in ["/exit", "exit", "quit", ":q"]:
                    print(HTML("<info>Goodbye! Thank you for using BOULT AI Ad Generator CLI.</info>"))
                    break

                elif cmd_lower in ["/help", "help", "?"]:
                    self.show_help()

                elif cmd_lower in ["/aspect", "aspect"]:
                    self.select_aspect_ratio_dialog()

                elif cmd_lower in ["/model", "model"]:
                    self.select_model_dialog()

                elif cmd_lower in ["/config", "config"]:
                    self.display_config()

                elif cmd_lower in ["/preset", "preset"]:
                    self.select_preset()

                elif cmd_lower.startswith("/enhance"):
                    parts = user_input.split(" ", 1)
                    raw = parts[1] if len(parts) > 1 else ""
                    if not raw:
                        raw = self.session.prompt(HTML("Enter prompt to enhance: ")).strip()
                    if raw:
                        enhanced = self.enhance_prompt(raw)
                        confirm = self.session.prompt(HTML("Generate with enhanced prompt now? (y/n): ")).strip().lower()
                        if confirm in ["y", "yes"]:
                            self.generate_ad(enhanced)

                elif user_input.startswith("/"):
                    print(HTML("<warning>Unknown command '{}'. Type /help for available commands.</warning>").format(user_input))

                else:
                    # Direct prompt generation
                    self.generate_ad(user_input)

            except KeyboardInterrupt:
                print(HTML("\n<warning>(Use /exit or Ctrl+D to quit)</warning>"))
            except EOFError:
                print(HTML("\n<info>Exiting BOULT CLI...</info>"))
                break


if __name__ == "__main__":
    cli = BoultCLI()
    cli.run()
