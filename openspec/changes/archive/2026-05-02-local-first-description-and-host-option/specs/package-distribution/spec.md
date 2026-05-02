## MODIFIED Requirements

### Requirement: Package metadata remains release-consistent
The system SHALL define the published package version in one authoritative metadata source, SHALL use that version for CLI `--version` output and npm package metadata, SHALL publish package metadata that points to the current `openspec-webui` repository, homepage, bug tracker, and license rather than an outdated upstream package identity, and SHALL use a description that accurately reflects the tool's local-first nature without implying remote server infrastructure.

#### Scenario: CLI version matches package metadata
- **WHEN** the maintainer updates the package version for a release
- **THEN** `openspec-webui --version` reports the same version that appears in the published package metadata

#### Scenario: Package metadata points to the current project
- **WHEN** a user inspects the published npm package metadata
- **THEN** the package name, repository URL, homepage URL, bug tracker URL, and license metadata identify the current `openspec-webui` project

#### Scenario: Package description reflects local-first positioning
- **WHEN** a user inspects the published npm package metadata or runs `openspec-webui --help`
- **THEN** the description does not contain "server-side" or other wording that implies a remote server
- **AND** the description communicates the local-first nature of the tool
