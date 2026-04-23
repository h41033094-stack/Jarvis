/**
 * J.A.R.V.I.S. Desktop Bridge
 * Description: Facilitates a high-bandwidth neural link between the React frontend and the Electron system shell.
 */

interface AppInfo {
  name: string;
  path: string;
}

const isElectron = () => {
    return (window as any).ipcRenderer !== undefined || (window as any).process?.versions?.electron !== undefined;
};

// Access ipcRenderer safely
const getIpc = () => {
  if (typeof window !== 'undefined' && (window as any).require) {
    try {
      return (window as any).require('electron').ipcRenderer;
    } catch (e) {
      return null;
    }
  }
  return null;
};

const ipc = getIpc();

export const desktopBridge = {
  isSupported: !!ipc,

  /**
   * Synchronize the local application lattice.
   */
  async syncApps(): Promise<AppInfo[]> {
    if (!ipc) return [];
    try {
      return await ipc.invoke('sync-apps');
    } catch (e) {
      console.error("Neural_Sync_Fault:", e);
      return [];
    }
  },

  /**
   * Initiate execution of a local software node.
   */
  async openApp(appPath: string): Promise<{ status: string }> {
    if (!ipc) return { status: 'unsupported' };
    try {
      return await ipc.invoke('open-app', appPath);
    } catch (e) {
      console.error("Execution_Fault:", e);
      return { status: 'error' };
    }
  },

  /**
   * Engage system-wide security lockdown.
   */
  async lockSystem(): Promise<{ status: string }> {
    if (!ipc) return { status: 'unsupported' };
    try {
      return await ipc.invoke('lock-system');
    } catch (e) {
      console.error("Lock_Protocol_Fault:", e);
      return { status: 'error' };
    }
  },

  /**
   * Configure neural core to initialize upon system boot.
   */
  async configureAutostart(enabled: boolean): Promise<{ status: string }> {
    if (!ipc) return { status: 'unsupported' };
    try {
      return await ipc.invoke('configure-autostart', enabled);
    } catch (e) {
      console.error("Configuration_Fault:", e);
      return { status: 'error' };
    }
  }
};
