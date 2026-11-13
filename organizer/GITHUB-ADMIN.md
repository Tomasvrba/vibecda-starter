# GitHub organization administration

Organization: https://github.com/VibeCdA

The starter was transferred from Tomasvrba on November 13, 2026, retaining its
repository ID, Git history, issues, Discussions, and workflow history. The local
Git remote now points to VibeCdA/vibecda-starter.

## Access model

- Tomasvrba remains the organization owner. Owner access is separate from team
  membership and can bypass the starter's branch protection for event maintenance.
- Base member permission is **None**. Public repositories remain publicly readable.
- **Organizers** has **Maintain** on the starter and the organization profile repo.
- **Mentors** has **Triage** on the starter for issues and Discussions, with no
  permission to push code or change settings.
- Participants use the public template and their own team repositories. They do
  not need organization membership to use the starter or Codespaces.
- Only owners can create private repositories, create teams, change repository
  visibility, or delete/transfer repositories. GitHub's current plan does not allow
  disabling public repository creation for members through its settings UI.
- Public Discussions remain open to readers. Private-repository forking stays off.
- No other people have been invited. Add people only once Tom supplies usernames
  and the intended role. Keep organization ownership limited to trusted operators.
- The sole owner's 2FA is enabled. Organization-wide enforcement remains off:
  GitHub's browser save redirected to a 404 at
  `/organizations/VibeCdA/settings/two_factor_enforcement`, and an API attempt
  left the value unchanged. An owner can retry at
  https://github.com/organizations/VibeCdA/settings/security. Secure-method-only
  enforcement was not enabled without verifying the owner's method.

## Repository and package settings

The public starter remains a template with Discussions enabled. Its `main`
branch requires a passing `build` check, one approving review, and resolved
conversations for non-admin changes. Force pushes and branch deletion are blocked.
Repository administrators can bypass; normal organizer contributors use pull
requests. Merged branches are deleted automatically.

Actions default to read-only repository permissions and cannot approve pull
requests. Publishing workflows request their specific package/Pages permissions.
Secret scanning and push protection are enabled; vulnerability alerts are enabled.

The public `.github` repository supplies the organization profile. Its README is
mirrored from organizer/github-profile/README.md in this starter; update both when
changing the organization overview.

The development image is published under `ghcr.io/vibecda/vibecda-dev` and inherits
access from the source repository. Public package creation is enabled so a new
participant can pull the image without organizer credentials. Old personal image
tags are retained as a fallback; do not delete them during the event.

## Links and external services

Participant guide: https://vibecda.github.io/vibecda-starter/

GitHub redirects the old repository URL, but the old personal GitHub Pages URL
does not have a guaranteed redirect. Share the organization guide URL and use
organizer/site-change-request.md for the existing website's webmaster.

GitHub organizations cannot own itch.io accounts. Both jams remain hosted by
`tmsvr`; their GitHub and guide links point to VibeCdA. The event website is still
managed by its existing webmaster. No paid Codespaces sponsorship, prebuilds, or
billing changes were enabled.

## Undo

Before the transfer, a Git bundle and settings snapshots were saved locally under
organizer/private/org-migration/ (ignored by Git). Treat these as private backups.
To undo, an owner can transfer the starter back to Tomasvrba, restore the original
URLs and image reference in Git, and redeploy Pages. Review the saved settings
before restoring permissions. Archive the organization profile repo if unused;
do not delete participant repositories or package history as part of rollback.
