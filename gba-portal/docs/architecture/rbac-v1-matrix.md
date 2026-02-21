# RBAC V1 — Matrice rôles × modules

Niveaux:
- `none`
- `read`
- `write`
- `approve`
- `admin`

Scopes:
- `team` (équipes assignées)
- `pole` (pôle assigné)
- `global` (tout le club)

## Rôles (validés)
- `admin`
- `resp_sportif`
- `responsable_pole`
- `coach`
- `adjoint`
- `dirigeant`
- `resp_administratif`
- `resp_equipements`

## Modules et droits recommandés (MVP)

| Module | admin | resp_sportif | responsable_pole | coach | adjoint | dirigeant | resp_administratif | resp_equipements |
|---|---|---|---|---|---|---|---|---|
| dashboard_home | admin/global | read/global | read/pole | read/team | read/team | read/team | read/global | read/global |
| planning | admin/global | approve/global | approve/pole | write/team | write/team | read/team | read/global | read/global |
| presences | admin/global | approve/global | approve/pole | write/team | write/team | write/team | read/global | read/global |
| convocations | admin/global | approve/global | approve/pole | write/team | write/team | write/team | read/global | read/global |
| tactique | admin/global | write/global | write/pole | write/team | write/team | read/team | read/global | read/global |
| effectif | admin/global | approve/global | approve/pole | write/team | write/team | read/team | write/global | read/global |
| joueurs_detail | admin/global | approve/global | approve/pole | write/team | write/team | read/team | write/global | read/global |
| equipes | admin/global | write/global | write/pole | read/team | read/team | read/team | read/global | read/global |
| staff | admin/global | write/global | read/pole | read/team | read/team | read/team | write/global | read/global |
| competitions | admin/global | write/global | write/pole | read/team | read/team | read/team | read/global | read/global |
| categories_poles | admin/global | write/global | read/pole | read/team | read/team | read/team | read/global | read/global |
| licences_admin | admin/global | read/global | read/pole | read/team | read/team | read/team | approve/global | read/global |
| equipements_stock | admin/global | read/global | read/pole | read/team | read/team | read/team | read/global | write/global |
| relances | admin/global | approve/global | approve/pole | write/team | write/team | write/team | approve/global | read/global |
| validations | admin/global | approve/global | approve/pole | read/team | read/team | read/team | approve/global | read/global |
| rapports | admin/global | read/global | read/pole | read/team | read/team | read/team | read/global | read/global |
| acces_permissions | admin/global | read/global | none | none | none | none | write/global | none |
| invitations_activation | admin/global | read/global | none | none | none | none | write/global | none |
| audit_logs | admin/global | read/global | read/pole | none | none | none | read/global | none |
| settings_club | admin/global | write/global | read/pole | none | none | none | write/global | none |

## Règle MVP importante
`coach` et `adjoint` ont volontairement les mêmes droits en V1.

## Évolution V2 (option)
Différencier `adjoint` en retirant certaines actions sensibles (delete/approve).
