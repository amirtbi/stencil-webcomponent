import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

export const config: Config = {
  namespace: 'WebComponentApp',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
    },

    // {
    //   type: 'www',
    //   serviceWorker: null, // disable service workers
    // },
  ],

  copy: [{ src: 'www/assets/core.js', dest: 'assets/core.js' }],

  plugins: [sass()],
};
