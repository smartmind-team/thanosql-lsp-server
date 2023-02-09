import * as monaco from "monaco-editor-core";

import Uri = monaco.Uri;
import { ThanosWorker } from "./ThanosWorker";

export class WorkerManager {
  private worker: monaco.editor.MonacoWebWorker<ThanosWorker>;
  private workerClientProxy: Promise<ThanosWorker>;

  constructor() {
    this.worker = null;
  }

  private getClientProxy(languageId: string): Promise<ThanosWorker> {
    if (!this.workerClientProxy) {
      this.worker = monaco.editor.createWebWorker<ThanosWorker>({
        // module that exports the create() method and returns a `JSONWorker` instance
        moduleId: "thanosWorker",
        label: languageId,
        // passed in to the create() method
        createData: {
          languageId: languageId,
        },
      });

      this.workerClientProxy = <Promise<ThanosWorker>>(
        (<any>this.worker.getProxy())
      );
    }

    return this.workerClientProxy;
  }

  async getLanguageServiceWorker(
    languageId: string,
    ...resources: Uri[]
  ): Promise<ThanosWorker> {
    const _client: ThanosWorker = await this.getClientProxy(languageId);
    await this.worker.withSyncedResources(resources);
    return _client;
  }
}
