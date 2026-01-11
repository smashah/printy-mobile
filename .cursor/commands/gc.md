Check git status for the current staged changes and come up with a scoped gitmoji based short commit message and suggested semver bump. 

Avoid using the sparkles unless no other gitmoji is relevant. (it's a sign of laziness)

Here are the gitmoji docs:

# Gitmoji Reference

This table lists the official Gitmojis, their corresponding shortcodes, descriptions, and semantic versioning (SemVer) type, if applicable.

| Emoji | Code                        | Description                                                   | SemVer |
| ----- | --------------------------- | ------------------------------------------------------------- | ------ |
| 🎨     | :art:                       | Improve structure / format of the code.                       |        |
| ⚡️     | :zap:                       | Improve performance.                                          | patch  |
| 🔥     | :fire:                      | Remove code or files.                                         |        |
| 🐛     | :bug:                       | Fix a bug.                                                    | patch  |
| 🚑️     | :ambulance:                 | Critical hotfix.                                              | patch  |
| ✨     | :sparkles:                  | Introduce new features.                                       | minor  |
| 📝     | :memo:                      | Add or update documentation.                                  |        |
| 🚀     | :rocket:                    | Deploy stuff.                                                 |        |
| 💄     | :lipstick:                  | Add or update the UI and style files.                         | patch  |
| 🎉     | :tada:                      | Begin a project.                                              |        |
| ✅     | :white_check_mark:          | Add, update, or pass tests.                                   |        |
| 🔒️     | :lock:                      | Fix security or privacy issues.                               | patch  |
| 🔐     | :closed_lock_with_key:      | Add or update secrets.                                        |        |
| 🔖     | :bookmark:                  | Release / Version tags.                                       |        |
| 🚨     | :rotating_light:            | Fix compiler / linter warnings.                               |        |
| 🚧     | :construction:              | Work in progress.                                             |        |
| 💚     | :green_heart:               | Fix CI Build.                                                 |        |
| ⬇️     | :arrow_down:                | Downgrade dependencies.                                       | patch  |
| ⬆️     | :arrow_up:                  | Upgrade dependencies.                                         | patch  |
| 📌     | :pushpin:                   | Pin dependencies to specific versions.                        | patch  |
| 👷     | :construction_worker:       | Add or update CI build system.                                |        |
| 📈     | :chart_with_upwards_trend:  | Add or update analytics or track code.                        | patch  |
| ♻️     | :recycle:                   | Refactor code.                                                |        |
| ➕     | :heavy_plus_sign:           | Add a dependency.                                             | patch  |
| ➖     | :heavy_minus_sign:          | Remove a dependency.                                          | patch  |
| 🔧     | :wrench:                    | Add or update configuration files.                            | patch  |
| 🔨     | :hammer:                    | Add or update development scripts.                            |        |
| 🌐     | :globe_with_meridians:      | Internationalization and localization.                        | patch  |
| ✏️     | :pencil2:                   | Fix typos.                                                    | patch  |
| 💩     | :poop:                      | Write bad code that needs to be improved.                     |        |
| ⏪️     | :rewind:                    | Revert changes.                                               | patch  |
| 🔀     | :twisted_rightwards_arrows: | Merge branches.                                               |        |
| 📦️     | :package:                   | Add or update compiled files or packages.                     | patch  |
| 👽️     | :alien:                     | Update code due to external API changes.                      | patch  |
| 🚚     | :truck:                     | Move or rename resources (e.g.: files, paths, routes).        |        |
| 📄     | :page_facing_up:            | Add or update license.                                        |        |
| 💥     | :boom:                      | Introduce breaking changes.                                   | major  |
| 🍱     | :bento:                     | Add or update assets.                                         | patch  |
| ♿️     | :wheelchair:                | Improve accessibility.                                        | patch  |
| 💡     | :bulb:                      | Add or update comments in source code.                        |        |
| 🍻     | :beers:                     | Write code drunkenly.                                         |        |
| 💬     | :speech_balloon:            | Add or update text and literals.                              | patch  |
| 🗃️     | :card_file_box:             | Perform database related changes.                             | patch  |
| 🔊     | :loud_sound:                | Add or update logs.                                           |        |
| 🔇     | :mute:                      | Remove logs.                                                  |        |
| 👥     | :busts_in_silhouette:       | Add or update contributor(s).                                 |        |
| 🚸     | :children_crossing:         | Improve user experience / usability.                          | patch  |
| 🏗️     | :building_construction:     | Make architectural changes.                                   |        |
| 📱     | :iphone:                    | Work on responsive design.                                    | patch  |
| 🤡     | :clown_face:                | Mock things.                                                  |        |
| 🥚     | :egg:                       | Add or update an easter egg.                                  | patch  |
| 🙈     | :see_no_evil:               | Add or update a .gitignore file.                              |        |
| 📸     | :camera_flash:              | Add or update snapshots.                                      |        |
| ⚗️     | :alembic:                   | Perform experiments.                                          | patch  |
| 🔍️     | :mag:                       | Improve SEO.                                                  | patch  |
| 🏷️     | :label:                     | Add or update types.                                          | patch  |
| 🌱     | :seedling:                  | Add or update seed files.                                     |        |
| 🚩     | :triangular_flag_on_post:   | Add, update, or remove feature flags.                         | patch  |
| 🥅     | :goal_net:                  | Catch errors.                                                 | patch  |
| 💫     | :dizzy:                     | Add or update animations and transitions.                     | patch  |
| 🗑️     | :wastebasket:               | Deprecate code that needs to be cleaned up.                   | patch  |
| 🛂     | :passport_control:          | Work on code related to authorization, roles and permissions. | patch  |
| 🩹     | :adhesive_bandage:          | Simple fix for a non-critical issue.                          | patch  |
| 🧐     | :monocle_face:              | Data exploration/inspection.                                  |        |
| ⚰️     | :coffin:                    | Remove dead code.                                             |        |
| 🧪     | :test_tube:                 | Add a failing test.                                           |        |
| 👔     | :necktie:                   | Add or update business logic.                                 | patch  |
| 🩺     | :stethoscope:               | Add or update healthcheck.                                    |        |
| 🧱     | :bricks:                    | Infrastructure related changes.                               |        |
| 🧑‍💻     | :technologist:              | Improve developer experience.                                 |        |
| 💸     | :money_with_wings:          | Add sponsorships or money related infrastructure.             |        |
| 🧵     | :thread:                    | Add or update code related to multithreading or concurrency.  |        |
| 🦺     | :safety_vest:               | Add or update code related to validation.                     |        |
| ✈️     | :airplane:                  | Improve offline support.                                      |        |

## Specification

You can extend Gitmoji and make it your own, but in case you want to follow the official specification, please continue reading 👀

A gitmoji commit message is composed using the following pieces:

- **intention**: The intention you want to express with the commit, using an emoji from the list. Either in the `:shortcode:` or unicode format.
- **scope**: An optional string that adds contextual information for the scope of the change.
- **message**: A brief explanation of the change.

```
<intention> [scope?][:?] <message>
```

## Examples

- ⚡️ Lazyload home screen images.
- 🐛 Fix onClick event handler
- 🔖 Bump version 1.2.0
- ♻️ (components): Transform classes to hooks
- 📈 Add analytics to the dashboard
- 🌐 Support Japanese language
- ♿️ (account): Improve modals a11y

## Shortcode vs Unicode format

You'll notice that when using emojis in commits, it's possible to use either the shortcode or the unicode format.

The difference between both is that the unicode represents the emoji itself while the shortcode is a text representation of the emoji that will be converted to the unicode character when rendered on a Git platform, such as GitHub, GitLab etc.

Both approaches are completely fine, you can choose the one you're most comfortable and suits you best. Let's understand the pros and cons of each approach so you can decide on it:

### Unicode

**Pros ✅**
- It represents the actual emoji no external systems are needed.
- Better git log.
- Easier to type.
- Takes less characters of the commit title.

**Cons ❌**
- Might not be supported in all terminals / operating systems.

### Shortcode

**Pros ✅**
- Supported everywhere as it's a text representation of the emoji.

**Cons ❌**
- You'll need a platform / system that knows how to properly render the shortcode.
- Different platforms / systems might use different shortcode namings, eg: GitHub and GitLab have some differences.
- Takes more characters of the commit title.


note:
✨ shouldn't be used all the time, it should be used when introducing a new package/app.