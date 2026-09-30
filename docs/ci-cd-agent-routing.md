# Residential CI/CD

The main `azure-pipelines.yml` follows the Business pipeline's sequential layout:

Setup & Version → Tests & Coverage → Quality & Security → Android Build → iOS Build → Validate Artifacts → TestFlight → Play Store Internal.

Each stage has one job and depends on the preceding stage. This limits each run to one active job; separate runs may overlap. Run releases one at a time to avoid racing the App Store Connect build-number lookup.

## Agent selection

In **Run pipeline → Build agent**, choose:

- `auto`: requester email `Mohit.Sharma@cableone.biz` selects `Sparklight-Mac`; other identities select Microsoft-hosted macOS.
- `Sparklight-Mac`: explicitly select the existing ARM64 Mac agent pool.
- `Azure Pipelines`: explicitly select hosted macOS.

The Setup log prints the requester identity and selected agent for diagnosing automatic routing. Authorize this Residential pipeline to use the existing pool and its existing secure files. The Mac must be online with Node, JDK 17, Android SDK, compatible Xcode, Ruby, CocoaPods and Fastlane available to its agent process.

## Versions and notes

Residential app IDs, provisioning profile, Android signing fingerprint, Play connection, branch triggers and the 90% default coverage threshold are retained. Android uses the existing Residential Azure counter. iOS uses the current marketing version's highest non-expired App Store Connect build plus one, starting at one if none exist; the lookup rejects a candidate already used by an expired build. Apple may still reject numbering based on its own upload history.

Commit messages become TestFlight notes and Android notes (maximum 300 characters). Generated PR title/description files are published in `release-notes`; the pipeline does not modify PRs. Store upload tasks are disabled for pull requests and respect the deployment parameters. Existing notification steps are retained.

## Runtime and validation

npm, Gradle, CocoaPods downloads and Xcode intermediate caches reduce repeated work. CI Metro bypasses Watchman to avoid stale indexes. Separate stages still perform their own dependency setup. The 30–40-minute runtime is a target, not a verified limit; stage timeouts are independent. Attaching TestFlight notes can wait for Apple to expose the uploaded build.

Local validation covers YAML parsing, embedded shell syntax, sequential dependencies, Residential paths/IDs, mocked Apple pagination/version selection, and release-note limits. A real Azure run is required to verify pool authorization, signing, store access and total duration. Lint/security reports retain the reference pipeline's advisory behavior.

On `Sparklight-Mac`, Xcode DerivedData stays in `$(Pipeline.Workspace)/xcode-derived-data` and the Azure Xcode Cache task is omitted, avoiding its large post-job upload. Hosted macOS jobs still restore/save the remote Xcode cache. Local reuse requires the same agent workspace to remain available; a new or cleaned workspace rebuilds it.
