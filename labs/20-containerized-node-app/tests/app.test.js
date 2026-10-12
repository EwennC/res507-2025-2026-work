import test from 'node:test'
import assert from 'node:assert'
import {buildApp} from '../app/app.js'

test('GET / responds with a page', async () => {
  const app = buildApp()
  const response = await app.inject({
    method: 'GET',
    url: '/'
  })
  
  // Vérification de la réussite de la requête
  assert.strictEqual(response.statusCode, 200)
  
  // TODO: Ajoutez ici vos assertions sur le contenu (body)
  // Par exemple, vous pourriez vérifier si le titre est présent
  // assert.ok(response.body.includes('Nom de votre application'))
})
