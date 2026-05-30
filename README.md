# Labelforge

![npm version](https://img.shields.io/npm/v/labelforge)
![npm downloads](https://img.shields.io/npm/dm/labelforge)
![license](https://img.shields.io/npm/l/labelforge)
![node](https://img.shields.io/node/v/labelforge)
![CI](https://github.com/OWNER/REPO/actions/workflows/ci.yml/badge.svg)
![issues](https://img.shields.io/github/issues/OWNER/REPO)
![pull requests](https://img.shields.io/github/issues-pr/OWNER/REPO)
![last commit](https://img.shields.io/github/last-commit/OWNER/REPO)


Labelforge is a CLI tool that synchronizes GitHub repository labels from reusable YAML templates.

It helps teams standardize label management across repositories by providing a simple, repeatable, and version-controlled workflow.

Labelforge supports:

* GitHub label synchronization from version-controlled YAML templates
* Dry-run mode to preview changes safely before applying them
* Built-in presets for common project types (backend, frontend, devops, infrastructure)
* Interactive template selection when no template is provided
* CI/CD-friendly JSON output for automation workflows
* Robust GitHub API handling (retry, timeout, rate-limit awareness)
* Local configuration support (authentication + default template)
* Cross-platform execution via Node.js (Linux, macOS, Windows)

The project is designed for developers, open-source maintainers, and engineering teams who need consistent label management across multiple repositories.

## Installation

### Requirements

* Node.js 18 or later
* A GitHub account
* A GitHub Personal Access Token (PAT) with repository label permissions

### Install from npm

```bash
npm install -g labelforge
```

### Verify Installation

```bash
labelforge --version
```

Expected output:

```text
labelforge version <version>
```

### GitHub Authentication

Before using Labelforge, configure your GitHub token:

```bash
labelforge login
```

You will be prompted to enter your GitHub Personal Access Token.

The token is stored locally in:

```text
~/.labelforge/config.json
```
## Quick Start

### 1. Authenticate with GitHub

```bash
labelforge login
```

### 2. Create a Template

```yaml
version: "1.0"

templates:
  - group: backend
    labels:
      - name: bug
        color: d73a4a
        description: Something is not working

      - name: enhancement
        color: a2eeef
        description: New feature or improvement
```

Save the file as:

```text
labels.yml
```

### 3. Preview Changes

```bash
labelforge sync owner repository labels.yml --dry-run
```

### 4. Apply Changes

```bash
labelforge sync owner repository labels.yml
```

### 5. Use a Built-In Preset

```bash
labelforge sync owner repository frontend
```

Available presets:
```
* backend
* frontend
* devops
* infra
```
## Templates

Labelforge uses YAML templates to define GitHub labels.

### Template Structure

```yaml
version: "1.0"

templates:
  - group: backend
    labels:
      - name: bug
        color: d73a4a
        description: Something is not working

      - name: enhancement
        color: a2eeef
        description: New feature or improvement
```

### Root Properties

| Property  | Type   | Required | Description                |
| --------- | ------ | -------- | -------------------------- |
| version   | string | Yes      | Template schema version    |
| templates | array  | Yes      | Collection of label groups |

### Group Properties

| Property | Type   | Required | Description                   |
| -------- | ------ | -------- | ----------------------------- |
| group    | string | Yes      | Group name                    |
| labels   | array  | Yes      | Labels belonging to the group |

### Label Properties

| Property    | Type   | Required | Description                       |
| ----------- | ------ | -------- | --------------------------------- |
| name        | string | Yes      | GitHub label name                 |
| color       | string | Yes      | Label color in hexadecimal format |
| description | string | No       | GitHub label description          |

### Example

```yaml
version: "1.0"

templates:
  - group: backend
    labels:
      - name: api
        color: 0052cc
        description: API related work

      - name: database
        color: 5319e7
        description: Database related work

      - name: bug
        color: d73a4a
        description: Something is not working

  - group: quality
    labels:
      - name: testing
        color: 0e8a16
        description: Testing activities

      - name: technical-debt
        color: fbca04
        description: Refactoring and maintenance
```

### Built-In Presets

Labelforge currently ships with the following presets:

* backend
* frontend
* devops
* infra

Presets can be used directly without creating a custom template file.
## Commands

### login

Stores a GitHub Personal Access Token for future operations.

```bash
labelforge login
```

---

### sync

Synchronizes GitHub repository labels from a template.

```bash
labelforge sync <owner> <repository> [template]
```

#### Parameters

| Parameter  | Required | Description                      |
| ---------- | -------- | -------------------------------- |
| owner      | Yes      | GitHub repository owner          |
| repository | Yes      | GitHub repository name           |
| template   | No       | Template file or built-in preset |

#### Examples

```bash
labelforge sync mehdi-zayani/my-repository backend
```

```bash
labelforge sync mehdi-zayani/my-repository labels.yml
```

```bash
labelforge sync mehdi-zayani/my-repository labels.yml --dry-run
```

---

### help

Displays command documentation.

```bash
labelforge help
```

or

```bash
labelforge --help
```

---

### version

Displays the installed version.

```bash
labelforge --version
```

---

## Global Options

| Option    | Description                           |
| --------- | ------------------------------------- |
| --dry-run | Preview changes without applying them |
| --json    | Output machine-readable JSON          |
| --silent  | Disable UI output                     |
| --verbose | Enable detailed logs                  |
| --help    | Display help information              |
| --version | Display current version               |

---

## Exit Codes

| Code | Meaning          |
| ---- | ---------------- |
| 0    | Success          |
| 1    | Execution failed |

## Examples

### Synchronize Labels Using a Built-In Preset

```bash
labelforge sync my-org/my-repository backend
```

---

### Synchronize Labels Using a Custom Template

```bash
labelforge sync my-org/my-repository labels.yml
```

---

### Preview Changes Before Applying

```bash
labelforge sync my-org/my-repository labels.yml --dry-run
```

This command displays the planned changes without modifying the repository.

---

### Enable Verbose Logging

```bash
labelforge sync my-org/my-repository labels.yml --verbose
```

Useful for troubleshooting and inspecting GitHub API operations.

---

### JSON Output

```bash
labelforge sync my-org/my-repository labels.yml --json
```

Produces machine-readable output suitable for automation and CI/CD workflows.

---

### Silent Mode

```bash
labelforge sync my-org/my-repository labels.yml --silent
```

Suppresses CLI output except for critical errors.

---

### Using a Default Template

If a default template is configured, the template argument can be omitted:

```bash
labelforge sync my-org/my-repository
```

Labelforge will resolve the template using the following order:

1. CLI argument
2. Configured default template
3. Interactive template selector

---

### CI/CD Example

```bash
labelforge sync my-org/my-repository backend --json
```

This mode is suitable for automated repository provisioning and standardization workflows.

## Configuration

Labelforge stores user configuration locally.

### Configuration File

```text
~/.labelforge/config.json
```

### Example

```json
{
  "token": "github_personal_access_token",
  "defaultTemplate": "backend"
}
```

### Properties

| Property        | Required | Description                                                    |
| --------------- | -------- | -------------------------------------------------------------- |
| token           | Yes      | GitHub Personal Access Token used for authentication           |
| defaultTemplate | No       | Template used when no template is provided on the command line |

### Default Template Resolution

When running:

```bash
labelforge sync <owner> <repository>
```

Labelforge resolves the template using the following order:

1. Template provided via CLI argument
2. `defaultTemplate` from configuration
3. Interactive template selection

### GitHub Token

A GitHub Personal Access Token is required to manage repository labels.

The recommended way to configure authentication is:

```bash
labelforge login
```

This stores the token in the local configuration file and avoids passing credentials through command-line arguments.
## Roadmap

### Version 1.0

* GitHub label synchronization
* YAML template support
* Built-in template presets
* Dry-run mode
* Interactive template selection
* JSON output mode
* Retry and timeout handling
* GitHub rate-limit awareness
* Local configuration management

### Future Improvements

* Additional template presets
* Template marketplace and sharing
* Import labels from existing repositories
* Template validation commands
* Advanced synchronization policies
* Bulk repository synchronization
* GitHub organization support
* Enhanced CI/CD integrations
* Extended reporting and analytics

### Long-Term Vision

Labelforge aims to become a standard tool for managing and standardizing GitHub labels across personal projects, teams, and large-scale engineering organizations.
## Contributing

Contributions are welcome.

### Development Setup

```bash id="k2q9x1"
git clone https://github.com/your-org/labelforge.git
cd labelforge
npm install
```

### Build

```bash id="b9p3aa"
npm run build
```

### Run in Development

```bash id="d7w1mz"
npm run dev
```

### Guidelines

* Follow existing code structure and architecture
* Keep changes consistent with domain separation (CLI / application / infrastructure)
* Avoid duplicating logic across GitHub request and sync engine layers
* Ensure TypeScript strict mode compliance
* Write clear and minimal commits

### Pull Request Process

1. Create a feature branch
2. Make your changes
3. Ensure project builds successfully
4. Test CLI commands manually
5. Submit a pull request with a clear description
## License

This project is licensed under the terms of the MIT License.

See the LICENSE file in the root of the repository for full details.
