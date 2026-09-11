# Enabling GitHub Sponsors

**Status: submitted, awaiting GitHub approval.** `[CLAIMED]` — the application is in; the public
profile has not published yet. Verified 2026-09-11: `github.com/sponsors/Solmex72` still redirects
to the plain profile page, which is what GitHub serves before a sponsors profile goes live.

Until it publishes, the README carries the PayPal button only. A sponsor badge pointing at a
profile that does not resolve is a value with no live source behind it, which this project's own
rules forbid shipping. The moment it resolves, it is two edits — both below.

Enabling Sponsors is the Operator's act by definition: it needs a sign-in and a payout account,
which [`00`](../protocol/00-PRECEDENCE.md) puts permanently in the Operator's hands.

---

## Checking whether it has published

A 200 proves nothing — GitHub returns 200 and redirects to the ordinary profile while the
application is pending. **Check the title, not the status code:**

```bash
curl -sL https://github.com/sponsors/Solmex72 | grep -oE '<title>[^<]*</title>'
#  pending  -> <title>Solmex72 · GitHub</title>                       (redirected)
#  live     -> <title>Sponsor @Solmex72 on GitHub Sponsors</title>
```

This is a live example of a check that looks like it passed and has not.

---

## Remaining steps

1. ~~Join the program at [github.com/sponsors](https://github.com/sponsors) as **@Solmex72**.~~ Done.
2. ~~Complete Stripe Connect onboarding.~~ Done — awaiting GitHub's review.
3. When the title check above flips, paste the profile copy and tiers below into the profile editor.
4. Make the two edits in [Once it is live](#once-it-is-live).

---

## Profile copy

**Short bio** (shown under your name, 1–2 lines):

> I build and give away Parvis — a file-based governance protocol for AI agent fleets. A stop that
> is honest about what it cannot do, claims that carry their evidence, and a warehouse floor you
> can watch it run on.

**Introduction** (the longer body):

> Parvis started as the rules holding together a private multi-agent system that ran daily for
> months. It answers three questions that get very hard once you have more than two agents
> touching your files: what does the fleet currently believe is true, which of its confident claims
> was ever actually checked, and how do I make all of it stop.
>
> It is given away in full — the protocol under CC BY 4.0, the code under MIT, zero dependencies,
> no paywalled tier and no feature held back for sponsors. Sponsorship funds the parts nobody
> volunteers for: the cross-platform test matrix, and the four open questions in DECISIONS.md
> getting properly designed instead of left to every adopter to answer alone.
>
> If it saved you an incident, a rewrite, or an afternoon of arguing with your own documentation,
> this is where you can put something back.

---

## Tiers

Deliberately few, and none of them gate anything. A tier that unlocks a feature turns the project
into a product with a free trial, which is not what this is.

| | Monthly | Name | Description |
|---|---|---|---|
| 1 | **$3** | **Reader** | You use it and it helped. That is a real contribution and it is enough. Your name in SPONSORS.md if you want it. |
| 2 | **$10** | **Operator** | You run Parvis over a real tree. Same as above, plus I will read and reply to your issues first — not fix them first, read them first. |
| 3 | **$25** | **Bridge** | Funds the cross-platform matrix that keeps the Windows / macOS / Linux claim honest. Named in the release notes for versions your sponsorship covered. |
| 4 | **$100** | **Flag** | Funds design work on the open questions in DECISIONS.md. I will talk through your fleet's governance for an hour a month if you want that; no obligation if you do not. |

**One-time tiers:** mirror the same four amounts. Many people prefer a single payment and should
not have to set up a subscription to give $10 once.

### What no tier includes

State this on the profile. It sets expectations correctly and it is true:

- No private features, no early access, no paywalled docs.
- No support SLA. This is one person.
- No influence over what goes in the protocol. Issues from sponsors and non-sponsors are judged
  the same way — on the merits, per [CONTRIBUTING.md](../CONTRIBUTING.md).

---

## Once it is live

Two edits, both small:

**1. `.github/FUNDING.yml`** — uncomment the github line:

```yaml
github: [Solmex72]
custom: ["https://www.paypal.com/donate/?hosted_button_id=KU3RLVTG3NGW8"]
```

**2. `README.md`** — put the badge back beside the PayPal one:

```markdown
[![Sponsor](https://img.shields.io/badge/GitHub-Sponsors-ea4aaa?logo=githubsponsors&logoColor=white)](https://github.com/sponsors/Solmex72)
```

Then verify before pushing — and **a 200 is not proof**. When a user has no sponsors profile,
GitHub redirects `/sponsors/<user>` to their ordinary profile page and returns 200, which is
exactly what this URL does today:

```bash
curl -sL https://github.com/sponsors/Solmex72 | grep -oE '<title>[^<]*</title>'
#  not enabled -> <title>Solmex72 · GitHub</title>        (redirected to the profile)
#  enabled     -> <title>Sponsor @Solmex72 on GitHub Sponsors</title>
```

Check the title, not the status code. The whole project is about not shipping a claim you have
not actually checked — and this is a live example of a check that looks like it passed.

---

## Why PayPal is live and Sponsors is not

The PayPal donation is a hosted donate button on the Woods Wiring LLC account, so it could ship
immediately. GitHub Sponsors cannot: the URL 404s until the program is joined and
onboarding completes.

Shipping both would have meant shipping one dead link. The protocol's own rule decided it —
a surface shows what it can actually verify, and renders nothing where it has no live source.
