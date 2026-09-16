# Task 01 production dependency audit — 2026-09-16

`npm audit --omit=dev` reports four high-severity package findings. These stem
from the same transitive multipart parser; they are not four independent
application vulnerabilities.

| Package | Installed | Affected range reported by npm | Relationship / dependency chain |
| --- | --- | --- | --- |
| multer | 2.2.0 | <=2.2.0 | Transitive: application -> @nestjs/platform-express -> multer |
| @nestjs/platform-express | 11.2.5 | <=12.0.1 | Direct: adapter -> multer; audit also propagates through core peer dependencies |
| @nestjs/core | 11.2.5 | 7.6.0-next.1 through 12.0.0 | Direct: core -> platform-express -> multer |
| @nestjs/typeorm | 11.0.3 | 8.0.0 through 11.0.3 | Direct: integration -> core -> platform-express -> multer |

Underlying Multer advisories:

- [Crafted multipart field names](https://github.com/advisories/GHSA-wc9g-mqfw-jrwm): high-severity denial of service; affects <2.3.0.
- [Aborted uploads leak file descriptors](https://github.com/advisories/GHSA-qfvm-cv95-jqjf): high-severity denial of service; affects 2.2.0.
- [Async fileFilter race](https://github.com/advisories/GHSA-qvfw-j98x-7q72): low-severity file-size limit bypass; affects <2.3.0.
- [Oversized array indexes](https://github.com/advisories/GHSA-535w-7cp7-47q4): high-severity denial of service; affects <2.3.0.

Multer 2.3.0 is a minor-version fix, but the installed Nest adapter pins Multer
exactly to 2.2.0. Registry inspection of published Nest 11 adapter releases found
no compatible release consuming the patch. Updating a standalone Multer copy
would not repair the adapter's dependency. npm proposes Nest core/adapter 12.0.3
and TypeORM integration 12.0.1, requiring major upgrades. No force install,
dependency override, or major upgrade was applied. Human review is required.

Current reachability: the application exposes only GET health endpoints and
does not configure FileInterceptor, FilesInterceptor, or multipart middleware.
The vulnerable upload parser is not invoked by current routes. This limits
current exposure but does not remove the dependency findings; reassess before
adding uploads or deploying. The three Nest findings inherit this same exposure.
