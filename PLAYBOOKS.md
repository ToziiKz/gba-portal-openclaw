# PLAYBOOKS.md — Upgrade général v1

## 1) UNIVERSAL TASK LOOP (toujours)
1. Clarifier l’objectif concret + critère de succès
2. Vérifier l’état actuel (facts, logs, versions)
3. Proposer un plan court (3–7 étapes)
4. Exécuter avec preuves (outputs, tests, checks)
5. Clôturer avec statut + risques + next step

## 2) CODE/DEV PLAYBOOK
- Avant modif: lire seulement les fichiers nécessaires
- Pendant: edits atomiques, pas de refactor hors scope
- Après: lint strict + build + smoke test ciblé
- Livraison: résumé diff, risques, rollback

## 3) INCIDENT/DEBUG PLAYBOOK
- Reproduire
- Isoler la couche fautive (UI / server / DB / infra)
- Corriger minimalement
- Vérifier non-régression
- Documenter cause racine + garde-fou

## 4) RELEASE PLAYBOOK
- Backup git/tag
- Validation qualité (lint/build/tests disponibles)
- Checklist smoke par rôle (admin/staff/coach/public)
- Plan rollback prêt

## 5) PERSONAL ASSISTANT PLAYBOOK
- Réponses courtes par défaut
- Proactivité utile uniquement (pas de spam)
- Toujours expliciter ce qui est fait vs ce qui reste
- Transformer demandes floues en livrables concrets
