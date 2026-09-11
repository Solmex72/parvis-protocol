#!/usr/bin/env sh
# Has the GitHub Sponsors profile published yet?
#
# A 200 proves nothing: while an application is pending, GitHub returns 200 and
# redirects /sponsors/<user> to the ordinary profile page. Check the title.
#
#   sh .github/check-sponsors.sh
#
# Exits 0 once it is live, 1 while it is still pending — so you can loop on it
# or gate the badge edit on it.

USER="${1:-Solmex72}"
TITLE=$(curl -sL "https://github.com/sponsors/$USER" | grep -oE '<title>[^<]*</title>' | head -1)

printf '  profile  github.com/sponsors/%s\n' "$USER"
printf '  title    %s\n' "$TITLE"

case "$TITLE" in
  *"Sponsor @$USER"*|*"GitHub Sponsors"*)
    printf '  status   LIVE\n\n'
    printf '  Two edits to make now:\n'
    printf '    1. .github/FUNDING.yml  — uncomment:  github: [%s]\n' "$USER"
    printf '    2. README.md            — restore the Sponsors badge beside PayPal\n\n'
    exit 0
    ;;
  *)
    printf '  status   PENDING — redirected to the plain profile\n\n'
    printf '  Leave the badge off until this flips. A dead sponsor link is a\n'
    printf '  value with no live source behind it.\n\n'
    exit 1
    ;;
esac
