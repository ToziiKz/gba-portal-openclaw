# HEARTBEAT.md

# Upgrade continu (léger, non intrusif)

## Règles
- Ne pas spammer. Envoyer une alerte uniquement si signal utile.
- Si rien d’utile: HEARTBEAT_OK

## Checks rotation (2-3 fois/jour max)
1) État repo gba-portal
- `git status --short`
- Signaler si dirty > 24h sans commit

2) Santé qualité rapide
- Lint/build uniquement si changements détectés
- Signaler uniquement en cas d’échec

3) Maintenance mémoire
- Vérifier memory du jour
- Ajouter uniquement les décisions durables

4) Hygiène agent
- Proposer micro-amélioration concrète (playbook, script, checklist)
- Ne rien faire si pas de gain net
