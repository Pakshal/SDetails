const config = window.SITE_CONFIG || {};
if (/^[\w.-]+\/[\w.-]+$/.test(config.repository || '') && typeof config.branch === 'string') {
  const base = `https://github.com/${config.repository}`;
  for (const [id,path] of [['locations','data/sadhviji.json'],['suvichar-edit','data/suvichar.txt']]) {
    const link = document.getElementById(id); link.href = `${base}/edit/${encodeURIComponent(config.branch)}/${path}`; link.hidden = false;
  }
  const status = document.getElementById('status-link'); status.href = `${base}/actions/workflows/pages.yml`; status.hidden = false;
  document.getElementById('setup').textContent = 'GitHub will ask you to sign in if needed. Only repository collaborators can commit updates directly.';
}
