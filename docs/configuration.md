# Configuration

Sigstore's components in this package are configured through their upstream [Sigstore charts](https://github.com/sigstore/helm-charts/) as well as a UDS configuration chart for each component.

## Networking

Network policies are controlled via the configuration charts in accordance with the [common patterns for networking within UDS Software Factory](https://github.com/defenseunicorns/uds-software-factory/blob/main/docs/networking.md).  Sigstore primarily interacts between its own components and with OIDC provides such as `sso.<domain>` and `gitlab.<domain>`.  If you do have other use cases however you can configure additional network policies with the `custom` key for a given component.

## Certificates

Sigstore's stack has several components that need to be wired up with certificates

### `fulcio`



### `tsa`


