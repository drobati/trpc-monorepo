# trpc-monorepo

A mono repo using [turborepo](https://turbo.build/repo/docs), that demonstrates how to setup a [trpc](https://trpc.io/docs) client and server setup. Built two years ago so probably needs to be updated.

## Features

- Mono Repo Setup with parallel build & test via turborepo.
- tRPC setup with two APIs and a React client.
- Shared auth package.
- TypeScript setup.

## Getting Started

1. **Clone the Repository**
   ```
   git clone https://github.com/drobati/trpc-monorepo.git
   cd trpc-monorepo
   ```

2. **Install**
   ```
   npm install
   ```

3. **Run**
   ```
   npm run build
   npm run dev
   ```
   - This starts the server on `http://localhost:8000`.

3. **RPCs Endpoints**

   - **auth/login**: Sign in as a user
   - **message/getMessages**: Get messages
   - **message/addMessage**: Add a new message

## Housekeeping

```
npm run format
npm run lint
npm run test
```
The usual

## Contributing

1. Fork the repository.
2. Create a new branch for your feature:
   ```
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```
   git commit -m "Add a new feature"
   ```
4. Push to your branch:
   ```
   git push origin feature-name
   ```
5. Open a Pull Request.

## License

This project is licensed under the MIT License.