# How to use Github pages to render p5.js sketches
> The instructions below are for getting started with p5.js in Github pages. It enables you to publish interactive versions of your source code.
> Please read the documentation for more advanced scenarios. 

## 1. Enable Github pages for you repository
Enabling Github pages for the repository will generate nice HTML pages for your markdown files. If the source code is at `https://github.com/username/repository/`, by default your pages will be served at `https://username.github.io/repository/`
If you have a "index.md" in the root of your repository, it you will become the "index.html" of your Github pages, and so on, including your sub-folders.
More instructions on how to enable pages [here](https://help.github.com/articles/configuring-a-publishing-source-for-github-pages/#enabling-github-pages-to-publish-your-site-from-master-or-gh-pages).
I recommend you create a basic `index.md` file and make sure your Github pages (`github.io`) works before proceeding to the next steps.

## 2. Add the custom template for processing.
### What is a template
The `.md` files are transformed into `.html` files by using a template. The template will among other things include the p5.js libraries, and most importantly,
 the reference to the `sketch.js` file you place in the sketch folder.
A sample template can be found [here](https://github.com/haschdl/generative/blob/master/_layouts/processingsketch.html)

### Where to save the template
The template file must be placed in a `_layouts` folder in the root of your repository.

## 3. Create a folder and `sketch.md` file.
In Github, I store each p5.js sketch in a separate folder, in a structure like this:
- repository
  - mySketch1
    - sketch.md
    - sketch.js
  - mySketch2
    - sketch.md
    - sketch.js
 
The `sketch.md` can be as simple as the snippet below. `layout` tells the processor to use our custom template defined in [2](#2), and `jsarr`
 instructs the processor to include our `sketch.js` in the final HTML page. 
> If your sketch is one single file `sketch.js`, you can simply copy and paste the contents below. If your sketch has dependencies to other scripts, add them to the same folder and add the names to `jsarr`:

```md
---
layout: processingsketch
jsarr:
- sketch.js
---
```
## 4. Browse to you Github pages
The generation of the HTML pages might take a few minutes, so start with a very simple sketch you know it's working.

## Troubleshooting
Most of the errors I received were due to modifications in the template. If it seems like your pages are not being generated as expected, the
first thing to check is for error messages during Github build - you get them in your inbox with subject **`Page build failure`**. This is one such messages I received:
> The page build failed for the `master` branch with the following error:
> A file was included in `/_layouts/default.html` that is a symlink or does not exist in your `_includes` directory. For more information, see https://help.github.com/articles/page-build-failed-file-is-a-symlink/.
> For information on troubleshooting Jekyll see:
>  https://help.github.com/articles/troubleshooting-jekyll-builds
> If you have any questions you can contact us by replying to this email.