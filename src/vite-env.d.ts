/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_BUCKET_NAME: string
  readonly VITE_APP_IDRIVE_REGION: string
  readonly VITE_APP_IDRIVE_ENDPOINT: string
  readonly VITE_APP_IDRIVE_ACCESS_KEY_ID: string
  readonly VITE_APP_IDRIVE_SECRET_ACCESS_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}