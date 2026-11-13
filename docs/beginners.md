# Your first vibeCDA game: a step-by-step guide

You do not need to install a game engine to use this starter. The easiest route
is to open a prepared workspace in your browser, change the game, and upload a
finished ZIP to itch.io. AI is optional; you can edit the files yourself.

If you get stuck, ask a mentor or post in
[community help](https://github.com/VibeCdA/vibecda-starter/discussions).
Copy the error message, say which step you reached, and keep passwords and login
codes out of screenshots.

## Choose where you want to work

- **I want the fewest installations:** start with [browser Codespaces](#1-create-your-own-copy).
- **I prefer VS Code on my laptop:** start in Codespaces, then [connect VS Code](#5-use-your-preferred-editor).
- **I use T3 Code:** [connect it to the Codespace](#t3-code-desktop) or use a local copy.
- **I want all files and development on my laptop:** go to [download and run locally](#6-download-your-project-and-work-on-your-own-computer).
- **I just want to play a finished game:** see [run-a-finished-game-zip](#7-play-a-finished-game-zip-on-your-computer).
- **My game is ready:** go to [upload and enter the jam](#8-upload-your-game-to-itchio).

## A few words you will see

| Word | What it means here |
| --- | --- |
| Repository / repo | Your project's files and saved change history on GitHub |
| Template | The starting project you copy to make your own game |
| Codespace | A development computer on GitHub's servers, with an editor you can open in a browser |
| Editor / IDE | The app where you change files, such as VS Code or T3 Code |
| Terminal | A panel where you type a command and press Enter |
| Preview / port 5173 | The browser address for your game while you develop it |
| Commit and push | Save a named version of your changes, then send it to your GitHub repository |
| Build / game ZIP | The finished browser files you upload to itch.io |

Code blocks below contain commands. Copy the text inside the box, paste it into
the terminal, and press Enter. You do not type the surrounding backticks.

## 1. Create your own copy

1. Sign into your own [GitHub account](https://github.com). Create one if needed.
2. Open the [vibeCDA starter](https://github.com/VibeCdA/vibecda-starter).
3. Click **Use this template → Create a new repository**.
4. For **Owner**, choose **your own account**. You do not need to join the
   VibeCdA organization. Give the project a name, such as `my-weekend-game`.
5. Choose **Public** if you want others to see your source; choose **Private** if
   your team needs that instead. Public source and a public playable game are
   separate choices. Follow your track's source-sharing requirements.
6. Click **Create repository**. Check that the page now shows
   **your-username / your-project-name**, rather than VibeCdA's starter.
7. If working in a team, one person creates this repository. That person uses
   **Settings → Collaborators** to invite teammates by their GitHub usernames.
   Each teammate accepts their invitation and works from this same team repo.

**You should now have:** a project you or your team owns. Changes go here, not
into the shared event starter.

If you already used **Open in a codespace** directly from the template, use the
editor's **Source Control → Publish Branch** to publish it to a new repository
under your account. Do that before substantial work; ask a mentor if unsure.

## 2. Open the prepared workspace

1. On **your new repository**, click the green **Code** button.
2. Choose **Codespaces → Create codespace on main**.
3. If GitHub asks about a configuration, use the default **vibeCDA · game studio**
   configuration. Let the first setup finish; it can take several minutes.
4. An editor opens in your browser. The left sidebar lists the project files.
5. Find the terminal at the bottom. If it is hidden, use
   **☰ → Terminal → New Terminal** or search for **Terminal: Create New Terminal**
   in the Command Palette (**Ctrl+Shift+P**, or **Cmd+Shift+P** on Mac).
6. In the terminal, enter:

   ```sh
   npm run dev
   ```

7. Open the **Ports** tab beside Terminal. Find **5173**, then choose its
   **Open in Browser** action. An **Open in Browser** notification may also appear.
8. The starter game opens in another browser tab. Try arrow keys or WASD; on a
   touch screen, hold a point on the game. Click **Three.js 3D demo** at the top
   to try the included 3D scene: drag to orbit and scroll/pinch to zoom.

**You should now see:** the game running. Leave the terminal running while
developing; **Ctrl+C** in that terminal stops it. A preview address is temporary
and is not your final submission.

Codespaces uses your GitHub allowance and any billing you have enabled. The
event does not supply paid cloud time. To stop it, visit
[Your Codespaces](https://github.com/codespaces), open its **…** menu, and choose
**Stop codespace**. Closing the browser tab alone is not the same as stopping it.
Stopped workspaces still use storage; push/export work before eventually deleting one.

## 3. Make your first change

1. Keep the game tab and editor tab open.
2. In the editor's file list, open **src → game.ts**. This is where the game rules,
   characters, and interactions live. The other main files are listed below.
3. Make one small change at a time. With an AI assistant, a useful first request
   is: **“Explain this game in plain language, then help me change one thing.
   Keep it working as a browser game for itch.io.”**
4. Save the file (**Ctrl+S** / **Cmd+S**). The game preview normally updates on its
   own. If not, refresh that game tab.
5. Play after each change. Before taking on the next big feature, run this in a
   **second terminal** so your development server keeps running:

   ```sh
   npm run build
   ```

6. If the build prints an error, copy the first error to your assistant or mentor.
   Fix it before piling on more changes.

| File or folder | What you change there |
| --- | --- |
| `src/game.ts` | Gameplay, movement, scoring, and the game scene |
| `src/three-game.ts` | The working Three.js 3D scene and camera controls |
| `src/main.ts` / `src/phaser-game.ts` | Demo selection / Phaser setup |
| `src/style.css` and `index.html` | The web page around the game |
| `public/` | Pictures, sounds, and other assets; drag files into the editor to upload them |
| `public/ASSETS.md` | Credits and licenses for assets you use |

### Use an AI assistant, if you want one

The Codespace already has Claude Code, Codex, and Gemini CLI installed. Pick
one you have access to; you do not need all three. Start it in a second terminal:

```sh
claude
```

Or follow the [AI login instructions](participants.md#ai-login-in-the-prepared-environment)
for your chosen tool. Use your own account. Installing a tool does not include a
subscription or unlimited usage. Complete sign-in in your own browser, and never
put a password, login code, or API key into your game files.

## 4. Save a version on GitHub

Saving a file changes the current workspace. **Commit and push** also give you a
version in your team's GitHub repository that you can recover elsewhere.

1. Click **Source Control** in the left sidebar (the branching-lines icon).
2. Look through the changed files. Check that this is your team's repository and
   that you are not including credentials or large folders such as `node_modules`.
3. Click **+** beside the intended files to stage them, or use **Stage All Changes**
   after reviewing the list.
4. Type a short description, such as `Add player movement`.
5. Click **Commit**, then **Sync Changes** or **Push** when offered.
6. Open your repository on GitHub and check that your latest change is visible.

Do this at useful milestones and before moving computers. Team members should
coordinate which files they edit; if Git reports a conflict, ask a mentor to help
merge the changes rather than overwrite someone else's work.

## 5. Use your preferred editor

You can keep using the browser editor. Connecting a desktop editor to a
Codespace keeps the files and commands **in the cloud**; it does not download
the project onto your laptop. [Section 6](#6-download-your-project-and-work-on-your-own-computer)
explains how to make a separate local copy.

### Desktop VS Code

1. Install [Visual Studio Code](https://code.visualstudio.com/) on your laptop.
2. Open Extensions (the blocks icon), search for **GitHub Codespaces**, and
   install the extension published by **GitHub**.
3. Open the Command Palette (**Ctrl+Shift+P** / **Cmd+Shift+P**), search for
   **Codespaces: Connect to Codespace**, and select it.
4. Sign into the same GitHub account you used above and select your Codespace.
5. Check the remote indicator at the bottom left. Open a terminal there and run
   `npm run dev` if it is not already running.
6. Use **Ports → 5173 → Open in Browser** to play. Commit and push as in section 4.

### T3 Code desktop

This route is more technical: T3 uses SSH, a private connection to the remote
computer. The container's SSH setup has been tested locally; the complete
T3-to-participant-Codespace route still needs a pilot. Ask a mentor to help if
these steps are unfamiliar. Browser VS Code remains available throughout.

1. Install T3 Code desktop using its [official installation instructions](https://github.com/pingdotgg/t3code/blob/main/docs/user/install.md).
   Also install [GitHub CLI](https://cli.github.com/) and an OpenSSH client on
   your laptop. On Windows, use the same environment for all three; a native
   desktop app may not find a WSL-only SSH configuration.
2. Open a terminal **on your laptop**, not the Codespace. Enter these one at a time:

   ```sh
   gh auth login
   gh codespace list
   ```

3. Sign into your GitHub account when prompted. In the list, find your project's
   Codespace. Copy its **NAME** value; that is different from the repository name.
4. Follow [the SSH setup instructions](editors.md#ssh-terminals-and-other-ides)
   to generate an SSH configuration and add its `Include` line to your existing
   configuration without replacing it. Test the generated alias with `ssh`.
5. In T3 desktop, choose **Settings → Environments → Add environment → SSH** and
   enter that generated SSH alias. T3 installs its matching server remotely.
6. Select that remote environment and add/open the project folder under
   `/workspaces/`. To find the exact folder, run `pwd` in the Codespace terminal.
7. Sign into your AI provider **in the remote environment**, if you have not
   already. A login on your laptop may not carry over.
8. Run `npm run dev` remotely. Use the ordinary Codespaces port-5173 browser tab
   for playing and audio; T3's streamed remote browser does not transmit audio.

The [editor guide](editors.md#t3-code-desktop) includes troubleshooting. You do
not need to expose a public T3 server port or install a T3 server by hand.

### Cursor, Windsurf, or another editor

Use that editor's SSH remote-development feature with the same generated SSH
alias. The exact menus and extension support vary, and these integrations have
not been tested for the event. If your editor cannot connect, use browser or
desktop VS Code, or open a [local copy](#6-download-your-project-and-work-on-your-own-computer).

## 6. Download your project and work on your own computer

This gives you the **source files**, so you can edit and build the game locally.
It requires Node.js on your laptop; Docker and a game engine are not required.

1. In your Codespace, **commit and push your latest work first**. A GitHub ZIP
   includes committed files on the selected branch, not unsaved cloud changes.
2. On your laptop, open **your team's repository** on GitHub. Select the branch
   you have been working on, usually **main**.
3. Click **Code → Local → Download ZIP** (some layouts show **Download ZIP**
   directly). Save it to your laptop.
4. **Extract/unzip it** into a folder you can find, such as Documents. Do not work
   inside the compressed ZIP. On Windows, right-click → **Extract All**; on Mac,
   double-click it.
5. Install [Node.js](https://nodejs.org/) **22.12 or newer**. Node 22 LTS is the
   version used by the prepared environment. Restart your editor after installing.
6. Open desktop VS Code or your preferred editor. Choose **File → Open Folder**
   and select the extracted folder that contains **package.json**, `src`, and
   `public`. If you see another single folder inside it, open that inner folder.
7. Open **Terminal → New Terminal** in that editor. Enter:

   ```sh
   node --version
   npm ci
   npm run dev
   ```

8. Wait for installation to finish, then open **http://localhost:5173** in your
   laptop browser. Keep the terminal running. **Ctrl+C** stops the game server.

The first `npm ci` needs internet to download dependencies. A source ZIP does
not include `node_modules`; that is expected. This local route does not install
the cloud environment's AI tools or ffmpeg/ImageMagick on your laptop.

**Important for continuing work:** a downloaded ZIP has no Git history or
connection for pushing updates. For ongoing team development, use **GitHub
Desktop → File → Clone repository → URL**, enter your team's repository URL,
then **Open in Visual Studio Code** and run the same commands. Alternatively use
`git clone` if you already know Git. That clone can commit/push back to the team
repository. Save any unique ZIP edits before switching to a clone; ask a mentor
to help copy them across.

For **T3 Code with local files**, add the extracted/cloned project folder to
T3's **local environment**. You do not need the Codespaces SSH connection for
this route. Set up your AI provider locally and run the same development commands.

## 7. Play a finished game ZIP on your computer

**artifacts/game.zip** is the built game for players/itch.io, not the source
project. It does not have `package.json` and cannot use `npm run dev`.

1. Build it with `npm run package` in your source project, if you have not already.
2. In the Codespace file list, expand **artifacts**, right-click **game.zip**, and
   choose **Download**. Your browser saves it to your laptop, usually Downloads.
3. Extract the ZIP to a folder. You should see `index.html` and an `assets` folder
   directly inside it.
4. Serve that folder through a small local web server. With Node installed, open
   the extracted folder in your editor, open its terminal, and run:

   ```sh
   npx --yes http-server . -p 8080 -c-1
   ```

5. The command downloads a small web-server utility on first use. Open
   **http://localhost:8080** to play, and press **Ctrl+C** to stop serving it.

Opening `index.html` by double-clicking can fail because browser games load
scripts/assets through a web server. This ZIP is not a Windows `.exe` or Mac app.
The easiest way for friends and judges to play is usually your finished itch.io page.

## 8. Upload your game to itch.io

### Create the file to upload

1. In the source project's terminal (Codespace or laptop), run:

   ```sh
   npm run package
   ```

2. Wait for it to finish successfully. The output file is **artifacts/game.zip**.
   If the command reports an error, fix it before uploading.
3. If using Codespaces, right-click **artifacts → game.zip → Download** in the
   file list. If working locally, find the file in your project's `artifacts` folder.
4. Keep the file zipped for upload. Upload **game.zip**, not the source-code ZIP
   downloaded from GitHub and not a ZIP containing an extra `dist` folder.

### Create the itch.io project page

1. Sign into [itch.io](https://itch.io/) with your team's chosen publishing account.
   Verify its email if asked. Do not share the account password with teammates.
2. Open your dashboard and choose **Create new project**.
3. Enter the game's title and a short description. Choose **Kind of project →
   HTML** so the game plays in the browser.
4. Under **Uploads**, click **Upload files** and choose **game.zip**.
5. After upload finishes, tick **This file will be played in the browser** beside
   the ZIP. If the wording differs, choose the option that makes this the HTML
   browser-playable build rather than only a download.
6. Set the embed size to **960 × 720**, or enable fullscreen/resizing. Add your
   controls, screenshots/cover, team credits, asset licenses, source link where
   required, and AI-use disclosure.
7. Save the page. Use **View page** and test that the game loads and the keyboard
   or touch controls work. Click/tap inside the game first when testing sound.
8. When ready, set the project's **Visibility & access** to **Public** and save.
   Test the game link in a signed-out/private browser window so judges can play.

### Enter the event's jam — a separate step

1. Open your track: [Freeplay](https://itch.io/jam/vibecda-2026-freeplay) or
   [Wizards and Lizards](https://itch.io/jam/vibecda-2026-wizards-and-lizards).
2. Click **Join jam** if you have not joined already. During the submission
   window, click **Submit your project**.
3. Select the itch.io game project you just created and answer the required
   submission questions. The game must be owned by or available to the account
   you are submitting with; ask the host if it does not appear.
4. Finish submitting, then check the jam's **Submissions** list for your game.
   Opening your game's page alone does not prove you entered the jam.
5. Save the submitted source version by committing and pushing it. Keep the ZIP
   you submitted too. New uploads are locked during judging.

**Deadline:** Sunday, November 15, 2026 at **noon Pacific**. Judging ends at
**5:30pm Pacific**, with awards at **6pm**. GTA Cda is a shared community project
and is not judged. Other engines need their own export/build instructions.

## FAQ and fixes

### Can I make a 3D game instead?

Yes. The default Codespace includes Three.js, its TypeScript types, and a working
3D example. Click **Three.js 3D demo** at the top of the game page and follow
[the Three.js walkthrough](threejs.md) to edit it. Codespaces handles development and building; your own browser/GPU
renders the game. The same packaging and itch.io upload steps apply.

### Do I need an AI subscription, GitHub organization invitation, or GPU?

You can use the starter without AI. AI tools need your own eligible account.
You do not need VibeCdA org membership or a GPU. The game renders in your browser.
Codespaces usage has its own allowance and billing, separate from AI access.

### Which terminal should I use?

Use the **Codespace terminal** to run commands on the cloud workspace. Use a
**laptop terminal** to run your downloaded/cloned project, install local tools,
or configure the SSH connection. A desktop editor attached to a Codespace still
runs its terminal remotely. A mentor can help identify which computer a terminal
is connected to before you install anything.

### I closed the tab. How do I get back?

Go to [Your Codespaces](https://github.com/codespaces), find the Codespace for
your project, and open it. Do not create a second one unless you intend to.
If your game server stopped, run `npm run dev` again and reopen port 5173.

### My preview will not open / localhost does not work.

In Codespaces, use **Ports → 5173 → Open in Browser**; `localhost` on your laptop
does not automatically reach the cloud machine. With a local copy, use
`http://localhost:5173` while `npm run dev` is running on that laptop. Check the
terminal for errors and that you are in the folder containing `package.json`.

### The terminal says npm or node is not recognized.

For local development, install Node.js and restart your editor. In Codespaces,
wait for setup to finish and confirm you used the prepared container. If Windows
PowerShell says `npm.ps1` cannot run, use `npm.cmd` instead of `npm`, or open a
Command Prompt terminal in the editor. Use `npx.cmd` in place of `npx` if needed.

### It says port 5173 or 8080 is already in use.

You may already have a server running in another terminal. Open that server's
preview, or stop it with Ctrl+C before starting again. Ask a mentor before
stopping a process you do not recognize.

### Can I just email/share my Codespaces preview as my submission?

It can stop working when your workspace stops, and private previews need access.
Upload the finished game to itch.io and submit it to the jam instead.

### I uploaded a ZIP but itch.io shows a blank screen or only a download.

Check that you uploaded **artifacts/game.zip**, selected **HTML**, and marked it
as playable in the browser. Inside the ZIP, `index.html` must be at the top level.
Use the browser console or ask a mentor to check missing asset paths. Confirm
you used `npm run package` after your most recent code changes.

### Will my AI login move with a downloaded ZIP?

No. Sign into the provider on the machine where it runs. Your files should never
contain AI account credentials, and `VITE_` variables are exposed to the browser.

### Can teammates use the same Codespace?

Each participant can create their own Codespace from the team repository.
Coordinate through commits, branches, and pushes. For screen sharing/pairing,
ask a mentor about collaboration tools; do not share a logged-in account.

### Am I done once my itch.io project page is public?

There is one more step: **Submit your project** on the correct jam page and
verify it appears in that jam's submissions. Uploading alone does not enter it.

More detail: [installed tools](tools.md), [editor connections](editors.md), and
[AI login / participant reference](participants.md).
