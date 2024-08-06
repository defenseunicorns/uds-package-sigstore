# Configuration

Sigstore's components in this package are configured through their upstream [Sigstore charts](https://github.com/sigstore/helm-charts/) as well as a UDS configuration chart for each component.

## Networking

Network policies are controlled via the configuration charts in accordance with the [common patterns for networking within UDS Software Factory](https://github.com/defenseunicorns/uds-software-factory/blob/main/docs/networking.md).  Sigstore primarily interacts between its own components and with OIDC provides such as `sso.<domain>` and `gitlab.<domain>`.  If you do have other use cases however you can configure additional network policies with the `custom` key for a given component.

## Certificates

Sigstore's stack has several components that need to be wired up with keys and/or certificates as described below.  This repository also contains `openssl` example configuration files under `src/certs` along with a helper task to generate example certificates by running `uds run dependencies:certs`.

> ![CAUTION]
> You may be tempted to create RSA keys for these components but these are NOT supported fully by Sigstore yet: https://github.com/sigstore/sigstore/issues/1528. ECDSA keys are what are generated and tested against in this repository.

### `fulcio`

Fulcio acts as a Web PKI implementation that issues code signing certificates - as such it needs to operate as a certificate authority and be provided with appropriate keys and certificates.  An example [intermediate certificate configuration file](../src/certs/fulcio.cnf) is used within this repository for testing alongside an example [root certificate configuration file](../src/certs/ca.cnf) that each meet Sigstore's [specification for Fulcio certificates](https://github.com/sigstore/fulcio/blob/main/docs/certificate-specification.md).

> ![NOTE]
> Not all of the requirements are called out in the `.cnf` files! Please carefully read through the Fulcio certificate specification before operating in production.

Fulcio uses Sigstore's [signature KMS package](https://github.com/sigstore/sigstore/tree/main/pkg/signature/kms) to connect to Key Management Services.  An example of configuring Helm overrides for OpenBao is below:

`uds-bundle.yaml`
```yaml
    overrides:
      fulcio:
        fulcio:
          values:
            - path: server.args.kms_resource
              value: hashivault://fulcio-key
            - path: server.env
              value:
                VAULT_ADDR: https://openbao.uds.dev
                VAULT_TOKEN: root
```

`uds-config.yaml`
```yaml
variables:
  sigstore:
    FULCIO_KMS_CERT_CHAIN: src/certs/fulcio.chain.pem
```

For AWS resources, IRSA is supported and the `kms_resource` would take the form: `awskms://<aws-endpoint-empty-string-if-na>/arn:aws:kms:us-east-1:000000000000:key/<aws-kms-key-id>`.

> ![NOTE]
> Even when you do not have an endpoint to specify you must still use the third `/` in `awskms:///`.

### `tsa`

The Sigstore Timestamp Authority issues [RFC-3161](https://datatracker.ietf.org/doc/html/rfc3161) timestamps and to operate it needs to also be provided with the appropriate keys and certificates for that purpose.  An example [timestamping certificate configuration file](../src/certs/tsa.cnf) is used within this repository for testing.

TSA also uses Sigstore's [signature KMS package](https://github.com/sigstore/sigstore/tree/main/pkg/signature/kms) to connect to Key Management Services and an example of configuring Helm overrides for OpenBao is below:

`uds-bundle.yaml`
```yaml
    overrides:
      tsa:
        tsa:
          values:
            - path: server.args.kms_key_resource
              value: hashivault://tsa-key
            - path: server.env
              value:
                VAULT_ADDR: https://openbao.uds.dev
                VAULT_TOKEN: root
```

`uds-config.yaml`
```yaml
variables:
  sigstore:
    TSA_KMS_CERT_CHAIN: src/certs/tsa.chain.pem
```

### `rekor`

Rekor doesn't need certificates but does need a keypair to sign log entries with.  Rekor also uses Sigstore's [signature KMS package](https://github.com/sigstore/sigstore/tree/main/pkg/signature/kms) to connect to Key Management Services and an example for OpenBao is below:

`uds-bundle.yaml`
```yaml
    overrides:
      rekor:
        rekor:
          values:
            - path: server.signer
              value: hashivault://rekor-key
              # TODO: (@WSTARR) This is a fun "hack" of the upstream Helm Chart - after https://github.com/sigstore/helm-charts/pull/790 should work to resolve this upstream
            - path: server.searchIndex.storageProvider
              value: mysql
            - path: server.searchIndex.mysql.envCredentials
              value:
                - name: VAULT_ADDR
                  value: https://openbao.uds.dev
                - name: VAULT_TOKEN
                  value: root
            - path: server.extraArgs
              value:
                - --search_index.storage_provider=redis
```

`uds-config.yaml`
```yaml
variables:
  sigstore:
    REKOR_PUBLIC_KEY: src/certs/rekor.pub.pem
```

### `ctlog`

The Certificate Transparency Log doesn't need certificates but does need a keypair to sign log entries with.  It also [does not integrate with a KMS (yet)](https://github.com/google/certificate-transparency-go/issues/1056) so you'll need to provide it a key separately.  Below is an example configuration:

`uds-config.yaml`
```yaml
variables:
  sigstore:
    CTLOG_PRIVATE_KEY: src/certs/ctlog.key.pem
    CTLOG_PUBLIC_KEY: src/certs/ctlog.pub.pem
```
