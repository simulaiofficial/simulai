<h1 align="center"><b>🤖 simulai</b></h1>
<p align="center">
  simulai is a Notion-inspired open-source conversational forms builder.
</p>
<p align="center">
  Effortlessly design your interactive forms that mimic natural conversations. Ideal for gathering insights and engaging users in interactive surveys, our tool is inspired by the simplicity of Notion and is completely free and open-source.
</p>
<p align="center">
  <a href="https://www.simulai.co" target="_blank">Try Simulai online for free</a>
</p>

<p align="center">

https://github.com/simulaiofficial/simulai/assets/149245098/6f319401-0f6d-4c33-a456-4ecd7cdf8458

</p>

## Features

- [x] Block-based chatbot editor
- [x] Drag to reorder blocks
- [x] Basic Markdown-parsing including bold, italic, URLs, headings and divider
- [x] Type '/' for command menu and shortcuts

## Contributing

**1. Clone this repository, go to the root directory and install packages**

Please use node >= v16.15.1, python >= 3.10.1

```bash
git clone https://github.com/simulaiofficial/simulai
cd simulai
npm i
virtualenv venv
pip install -r requirements.txt
```

**2. Run dev**

```bash
uvicorn api.main:app --reload --port 5678 --host 0.0.0.0
npm run dev
```

**2. Run prod**

```bash
gunicorn api.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:5678 --daemon
npm run build
npm run preview
```

If you head
to http://127.0.0.1:5173/?page=http%3A//127.0.0.1%3A5678/page%3Fsrc%3Dhttp%3A%2F%2F127.0.0.1%3A5678%2Fsrc/1234 on
your browser, you should see what looks like the screenshot above.

**3. Contribute!**

Simulai is quite limited for now but we hope it serves as a good starting point for other folks looking to build their
own chatbot editors.

We would love to make Simulai more extensible and welcome any suggestions or contributions!

See CONTRIBUTING.md for details.

## Acknowledgements

Initial code was based on Lotion repo built by Dashibase, thank you!

- [Lotion](https://github.com/Dashibase/lotion)

This was made much easier with the following libraries and frameworks, thank you!

- [vue-draggable-next](https://github.com/anish2690/vue-draggable-next)
- [tiptap](https://tiptap.dev/) and [ProseMirror](https://prosemirror.net/)
- [Vue 3](https://vuejs.org/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Headless UI](https://headlessui.dev/)
- [Oh, Vue Icons!](https://oh-vue-icons.js.org/)
- [Vitest](https://vitest.dev/)
- [Playwright](https://playwright.dev/)
