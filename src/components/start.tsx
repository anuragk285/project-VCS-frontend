import { useCloth } from '@/api/cloths'

function Start() {
  const { data: cloth, isPending, isError, error } = useCloth(1)

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center text-2xl font-bold mx-96">
      <p>I am really happy to see you here. Let's keep this motivation pumping through the whole project.</p>

      {isPending && <p className="mt-4 text-base text-muted-foreground">Loading…</p>}
      {isError && <p className="mt-4 text-base text-destructive">{error.message}</p>}
      {cloth && <p className="mt-4">{cloth.name}</p>}
    </div>
  )
}

export default Start