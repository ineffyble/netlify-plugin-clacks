import test from 'ava'

test('Deployed site should have header', async (t) => {
    const res = await fetch(process.env.SMOKE_TEST_URL || 'https://netlify-plugin-clacks.netlify.app/');
    t.is(res.headers.get('X-Clacks-Overhead'), 'GNU Terry Pratchett');
  })