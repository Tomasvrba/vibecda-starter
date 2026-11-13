# vibeCDA showcase

A one-page deck of browser games people built with Claude Fable 5.2 and Opus 5.5,
shown before the jam so participants can see what is possible.

- View it locally: `npm run dev`, then open <http://localhost:5173/showcase/>.
- Published copy: `npm run hub:build` copies this folder to `dist-hub/showcase/`,
  which GitHub Pages serves at `/showcase/` next to the participant guide.
- Present it: scroll, or press ↓ / space to move one scene at a time. ↑ goes back.

It is plain HTML, CSS and JavaScript with no dependencies. It is not part of the
game build, so it never ends up in a participant's `game.zip`.

## Editing the games

Everything on the page comes from `games.json`. Each game has a `play` link, the
creator's `links`, an optional `video` (`x` post id or `youtube` id) and a
`poster` picture. Set `featured: true` to give a game its own scene.

## Sources and credits

- Each entry links to the creator's own post, repository or page. Build times,
  costs and prompt counts are the creators' own figures, checked on 13 Nov 2026.
- Pictures are loaded from the creators' sites and are not stored in this
  repository. Videos load from X or YouTube only when someone presses play.
- The games, names and artwork belong to their creators. Entries tagged
  "Fan game" are unofficial tributes to other studios' games.
- This is an unofficial community page. It is not affiliated with Anthropic.
- Research, data and page built with Claude Code.
