# 1. Record architecture decisions

Date: 2024-06-25

## Status

Pending

## Context

We need to decide on a way to provide key management for signing of attestations and artifacts within UDS Software Factory.  This will mainly be used to create in-toto attestations to validate CI components ran as expected for a given artifact but ideally could be used for other use cases where feasible.

For this we evaluated the following:

### SPIFFE/SPIRE

SPIFFE (the framework) and SPIRE (the implementation) provides workload identities that could be used in GitLab CI to sign in-toto attestations and is the lightest / easiest option to manage given it has good integration with Kubernetes and really only has two components (the Agent(s) and the Server).  It can also be expanded to provide identities for other services too such as being able to be integrated with Istio and could enable cross-cluster service meshes.  User attestation however would be more difficult however given SPIFFE/SPIRE's predeliction toward workload attestation.

### Sigstore's Stack

Sigstore's Stack (Fulcio, Rekor, Trillian, CTLog, TUF, and Timestamp Authority) can use the OIDC identity of the user who ran a GitLab CI pipeline as well as supporting user signing flows that could be used to sign things like Docker images and Git commits.  It is a relatively complex stack to manage compared to the other options here but it does provide a lot more flexibility without completely relying on a cloud infrastructure provider.

### KMS Signers

We could also choose to use a cloud infrastructure provider's KMS such as AWS KMS or GCP KMS.  Witness however only supports those KMS providers though and while Azure Key Vault and Hashicorp Vault support is planned it is not available today.  Hashicorp Vault is also a BSL product and the other options require integration with specific cloud providers that may not be available in all cases.

## Decision

For this solution we decided to go with Sigtore's stack of products for its flexibility for software development use cases and its ability to be configured and run absent of specific cloud infrastructure support (if needed).

## Consequences

This implementation will require deeper integration into UDS and more work to get fully functional than the other options.  It will also cost more cluster resources though in testing this hasn't been much more than other SWF maintained applications.
