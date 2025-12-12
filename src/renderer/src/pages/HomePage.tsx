import { createSignal, type Component } from 'solid-js'
import Versions from '../components/Versions'
import electronLogo from '../assets/electron.svg'
import Teste from '@renderer/components/Teste';

const HomePage: Component = () => {
  const [count, setCount] = createSignal<number>(0);

  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <>
      <img alt="logo" class="logo" src={electronLogo} />
      <div class="creator">Powered by electron-vite</div>

      <div class="text">
        Build an Electron app with <span class="solid">Solid</span>
        &nbsp;and <span class="ts">TypeScript</span>
      </div>

      <p class="tip">
        O botão foi clicado <code>{count()}</code> vezes.
      </p>

      <Teste
        text='Bom dia'
        mainColor='#c5edd0'
      />

      <div class="actions">
        <div class="action">
          <a onClick={() => setCount(prev => prev + 1)}>
            Contar
          </a>
        </div>

        <div class="action">
          <a onClick={ipcHandle}>
            Send IPC
          </a>
        </div>
      </div>

      <Versions />
    </>
  )
}

export default HomePage;