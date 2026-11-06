import { readJobCardRecords } from "../src/lib/jobs/read-jobs";
import { checkJobImages } from "../src/lib/jobs/check-images";

Promise.all([readJobCardRecords(), checkJobImages()])
  .then(([jobs, imageCount]) =>
    console.log(
      `Validated ${jobs.length} job entries and ${imageCount} images.`,
    ),
  )
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
