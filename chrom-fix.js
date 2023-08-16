async function downloadChromium(options, targetRevision) {
  console.log(options); //Checking
  const browserFetcher = puppeteer.createBrowserFetcher({
    path: options.localDataDir,
  });
  const revision =
    targetRevision ||
    require('puppeteer-core/package.json').puppeteer.chromium_revision;
  const revisionInfo = browserFetcher.revisionInfo(revision);
  console.log(revisionInfo); //checking
  // Do nothing if the revision is already downloaded.
  if (revisionInfo.local) return revisionInfo;

  // Override current environment proxy settings with npm configuration, if any.
  try {
    console.log(`Downloading Chromium r${revision}...`);
    const newRevisionInfo = await browserFetcher.download(
      revisionInfo.revision
    );
    console.log('Chromium downloaded to ' + newRevisionInfo.folderPath);
    let localRevisions = await browserFetcher.localRevisions();
    localRevisions = localRevisions.filter(
      (revision) => revision !== revisionInfo.revision
    );
    // Remove previous chromium revisions.
    const cleanupOldVersions = localRevisions.map((revision) =>
      browserFetcher.remove(revision)
    );
    await Promise.all(cleanupOldVersions);
    return newRevisionInfo;
  } catch (error) {
    console.error(`ERROR: Failed to download Chromium r${revision}!`);
    console.error(error);
    return null;
  }
}
