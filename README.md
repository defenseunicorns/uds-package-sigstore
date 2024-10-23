# 🏭 UDS Sigstore Package

[<img alt="Made for UDS" src="https://raw.githubusercontent.com/defenseunicorns/uds-common/refs/heads/main/docs/assets/made-for-uds-bronze.svg" height="20px"/>](https://github.com/defenseunicorns/uds-core)
[![Latest Release](https://img.shields.io/github/v/release/defenseunicorns/uds-package-sigstore)](https://github.com/defenseunicorns/uds-package-sigstore/releases)
[![Build Status](https://img.shields.io/github/actions/workflow/status/defenseunicorns/uds-package-sigstore/release.yaml)](https://github.com/defenseunicorns/uds-package-sigstore/actions/workflows/release.yaml)
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/defenseunicorns/uds-package-sigstore/badge)](https://api.securityscorecards.dev/projects/github.com/defenseunicorns/uds-package-sigstore)

> [!NOTE]
> `uds-package-sigstore` is only a Bronze package and does not support all Sigstore features yet! If you would like to improve the package we welcome PRs! (see [Contributing](#contributing) below)

> [!IMPORTANT]  
> The `arm64` package includes `amd64` images due to lack of availability of `arm64` images from upstream projects at this time. This means you can deploy the `arm64` package on an `arm64` kubernetes cluster, but some of the images contained in the package will require emulation (e.g., qemu or rosetta) to run properly.

This package is designed for use as part of a [UDS Software Factory](https://github.com/defenseunicorns/uds-software-factory) bundle deployed on [UDS Core](https://github.com/defenseunicorns/uds-core).

## Prerequisites

This package requires a Kubernetes Cluster providing a Storage Class that has [UDS Core](https://github.com/defenseunicorns/uds-core) installed into it.  You can learn more about configuring this package in the [configuration documentation](./docs/configuration.md)

## Releases

The released packages can be found in [ghcr](https://github.com/defenseunicorns/uds-package-sigstore/pkgs/container/packages%2Fuds%sigstore).

## UDS Tasks (for local dev and CI)

*For local dev, this requires installing [uds-cli](https://github.com/defenseunicorns/uds-cli?tab=readme-ov-file#install)

After installing uds-cli, for a list of available tasks that can be run in this repository execute the following command:

`uds run --list`

## Contributing

Please see the [CONTRIBUTING.md](./CONTRIBUTING.md)

## Development

When developing this package it is ideal to utilize the json schemas for UDS Bundles, Zarf Packages and Maru Tasks. This involves configuring your IDE to provide schema validation for the respective files used by each application. For guidance on how to set up this schema validation, please refer to the [guide](https://github.com/defenseunicorns/uds-common/blob/main/docs/uds-packages/development/development-ide-configuration.md) in uds-common.
