const path = require('path');
const Dotenv = require('dotenv-webpack');
const { name, version, url } = require('./package.json');

let sections = [
  {
    name: 'README',
    content: 'README.md',
  },
  {
    name: 'Hooks',
    components: ['src/components/useSearchPhotos/useSearchPhotos.jsx'],
  },
  {
    name: 'Canvas component',
    content: 'src/components/Canvas/CanvasDescription.md',
    sections: [
      {
        name: 'Drawing shapes',
        content: 'src/components/Canvas/CanvasFigure.md',
      },
      {
        name: 'Drawing an image',
        content: 'src/components/Canvas/CanvasImage.md',
      },
      {
        name: 'Drawing text',
        content: 'src/components/Canvas/CanvasText.md',
      },
      {
        name: 'Drawing general',
        content: 'src/components/Canvas/CanvasAll.md',
      },
    ],
  },
  {
    name: 'Search Block',
    components: ['src/components/SearchPhotosApp/SearchPhotosApp.js'],
  },
];

module.exports = {
  components: 'src/components/**/[A-Z]*.js',
  ribbon: {
    url,
    text: 'Open on GitHub',
  },
  title: `${name} v${version}`,
  template: {
    head: {
      meta: [
        {
          name: 'description',
          content: 'React component library template',
        },
      ],
      scripts: [
        {
          src: 'https://cdn.tailwindcss.com',
        },
      ],
    },
  },
  moduleAliases: { [name]: path.resolve(__dirname, 'src') },
  skipComponentsWithoutExample: true,
  sections,
  styles: function styles(theme) {
    return {
      ComponentsList: {
        isSelected: {
          fontWeight: 'normal',
          '&>a': {
            fontWeight: 'bold !important',
          },
        },
      },
      Code: {
        code: {
          backgroundColor: '#eff1f3',
          fontSize: 14,
          borderRadius: '6px',
          padding: '.2em .4em',
        },
      },
    };
  },
  theme: {
    color: {
      link: '#4B4E6A',
      linkHover: '#2B3847',
      baseBackground: '#fff',
      border: '#D0DAE4',
      sidebarBackground: '#fff',
    },
    fontFamily: {},
  },
  exampleMode: 'expand',
  usageMode: 'expand',
  pagePerSection: true,
  getComponentPathLine(componentPath) {
    const componentName = path.basename(componentPath, '.js');
    return `import { ${componentName} } from '${name}';`;
  },
  updateExample(props, exampleFilePath) {
    const { settings, lang } = props;
    if (typeof settings?.file === 'string') {
      const filepath = path.resolve(path.dirname(exampleFilePath), settings.file);
      settings.static = true;
      delete settings.file;
      return {
        content: fs.readFileSync(filepath, 'utf8'),
        settings,
        lang,
      };
    }
    return props;
  },
  assetsDir: 'images',
  webpackConfig: {
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
      ],
    },
    plugins: [
      new Dotenv({
        systemvars: true,
      }),
    ],
  },
};
