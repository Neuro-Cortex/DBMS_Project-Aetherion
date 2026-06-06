## Codely Added Memories
- npm global config had `omit=dev` which prevents devDependencies from installing. Fixed with `npm config set omit ""`. Must use `npm install --include=dev` to ensure devDeps are installed for this project.
