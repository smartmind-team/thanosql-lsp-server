// @internal
import * as monaco from "monaco-editor-core";
import { WorkerManager } from "./WorkerManager";
import { ThanosWorker } from "./ThanosWorker";
import DiagnosticsAdapter, { WorkerAccessor } from "./DiagnosticsAdapter";
import "../index.css";

(self as Window).MonacoEnvironment = {
  getWorker: function (_workerId, label) {
    const getWorkerModule = (moduleUrl: string, label: string) => {
      return new Worker(new URL(moduleUrl, window.location.href).href, {
        name: label,
        type: "module",
      });
    };

    switch (label) {
      case "thanosql":
      case "thanos":
        return getWorkerModule("/src/thanos.worker.ts", label);
      default:
        return getWorkerModule(
          "/node_modules/monaco-editor-core/esm/vs/editor/editor.worker.js",
          label
        );
    }
  },
} as monaco.Environment;

// register Monaco languages
monaco.languages.register({
  id: "thanosql",
  extensions: [".sql"],
  aliases: ["thanosql", "thanos"],
});

// Call Worker Manager
monaco.languages.onLanguage("thanosql", () => {
  const client = new WorkerManager();
  const worker: WorkerAccessor = (
    ...uris: monaco.Uri[]
  ): Promise<ThanosWorker> => {
    return client.getLanguageServiceWorker("thanosql", ...uris);
  };
  // Call the errors provider
  new DiagnosticsAdapter(worker);
});

const editor = monaco.editor.create(document.getElementById("app")!, {
  value: "--thanosql-lsp-client-example",
  language: "thanosql",
  glyphMargin: true,
  lightbulb: {
    enabled: true,
  },
  automaticLayout: true,
  minimap: {
    enabled: false,
  },
});
