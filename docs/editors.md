# Connect your editor to the Codespace

For a plain-language walkthrough from the beginning, use
[Your first vibeCDA game](beginners.md#5-use-your-preferred-editor).

The code and terminals stay in the Codespace whichever editor you use. Stop the
Codespace when finished, and commit/push milestones to your team's repository.
Each participant uses their own GitHub and AI accounts.

## Browser VS Code

Open the Codespace from GitHub. Run `npm run dev` in its terminal and open port
5173 in **Ports**. Keep that port private during development. This is the
simplest supported route and needs no local SSH setup.

## Desktop VS Code

Install desktop VS Code and the **GitHub Codespaces** extension published by GitHub. Sign
into GitHub, open **Remote Explorer → GitHub Codespaces**, and connect to your
running Codespace. You can also select **Open in VS Code** from the Codespaces
menu on GitHub. The extension handles the connection.

If you use GitHub CLI on your laptop:

```sh
gh auth login
gh codespace list
gh codespace code -c YOUR_CODESPACE_NAME
```

See [GitHub's VS Code instructions](https://docs.github.com/en/codespaces/developing-in-a-codespace/using-github-codespaces-in-visual-studio-code).

## SSH terminals and other IDEs

Install [GitHub CLI](https://cli.github.com/) and an OpenSSH client on your
**laptop**, then authenticate there. GitHub CLI in the remote container is not
needed for this connection. If already authenticated, skip `gh auth login`.

```sh
gh auth login
gh codespace list
gh codespace ssh -c YOUR_CODESPACE_NAME
```

If GitHub CLI reports a missing Codespaces scope, run
`gh auth refresh -h github.com -s codespace` on your laptop and approve access
with your account. GitHub CLI may create/select a personal SSH key for the
connection. The starter now includes the official SSH server feature; if you
created a Codespace before that change, pull the latest configuration and use
**Codespaces: Rebuild Container** first. Commit and push your work beforehand.

For tools that accept an ordinary SSH host, generate an OpenSSH configuration:

```sh
mkdir -p ~/.ssh
gh codespace ssh --config -c YOUR_CODESPACE_NAME > ~/.ssh/vibecda-codespaces
chmod 600 ~/.ssh/vibecda-codespaces
```

If you already use that output filename, choose a new one to preserve it. Edit
`~/.ssh/config` and add this at the **top**, outside any `Host` or `Match` block;
preserve the existing contents:

```sshconfig
Include ~/.ssh/vibecda-codespaces
```

Read the generated file's `Host` line to find your alias. Test it:

```sh
ssh YOUR_GENERATED_HOST_ALIAS
```

The generated configuration uses GitHub CLI as a proxy. Your IDE must be able
to run that same local `gh` executable and read that SSH configuration. On
Windows, keep the IDE, `gh`, and SSH setup in the same environment; a native
Windows app may not read a WSL SSH configuration.

An editor with SSH remote-development support can use this alias. Cursor,
Windsurf, and JetBrains have different remote plugins and requirements; use
their SSH connection flow rather than assuming they support the VS Code
Codespaces extension. Those individual IDE integrations have not been tested
for this event.

Reference: [`gh codespace ssh`](https://cli.github.com/manual/gh_codespace_ssh).
Do not publicly forward the SSH port.

## T3 Code desktop

**T3 Code should work through its desktop-managed SSH environment support.**
The starter's SSH server and AI CLI discovery have been tested in a local
container. A full T3 Code connection to an actual participant-owned Codespace
still needs a pilot; use browser or desktop VS Code if that connection fails.

1. Complete the laptop SSH configuration above and confirm `ssh YOUR_ALIAS`
   connects successfully.
2. In that remote terminal, open your project under `/workspaces/` and log into
   the AI provider you use, following [participant login instructions](participants.md).
   Credentials belong to this remote environment, so a laptop login alone may
   not be enough.
3. In T3 Code desktop, open **Settings → Environments → Add environment → SSH**.
   Enter the generated SSH alias.
4. T3 Code downloads/starts its matching server in `~/.t3/runtime` in the
   Codespace and forwards its private connection. You do not need to preinstall
   the T3 CLI. Select the remote environment and add the project directory
   under `/workspaces/`.
5. Run `npm run dev` remotely. Open the game through the normal Codespaces
   forwarded port 5173, especially when testing audio. T3's remote browser does
   not stream audio to your device.

If provider discovery fails, check the same non-interactive login shell used by
remote launchers, from your laptop:

```sh
ssh YOUR_ALIAS 'sh -lc "command -v claude; command -v codex; command -v gemini"'
```

All three paths should resolve under `/opt/vibecda/tools/bin`. The updated
container configures that path through `/etc/profile.d/vibecda-tools.sh`.
Rebuild an older Codespace if it is missing.

T3 may download its own browser on first use, separate from the preinstalled
Playwright browser. Stop/rebuild events interrupt remote work; reconnect once
the Codespace is running again. Keep the T3 control connection private through
SSH; there is no need to expose a public T3 server port.

If you prefer a local browser URL for the game, GitHub CLI can forward it:

```sh
gh codespace ports forward 5173:5173 -c YOUR_CODESPACE_NAME
```

Leave that command running and open `http://localhost:5173` on your laptop while
the remote Vite server runs.

Reference: [T3 Code remote-access documentation](https://github.com/pingdotgg/t3code/blob/main/docs/user/remote-access.md).
