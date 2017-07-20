import marked from 'marked';

const renderer = new marked.Renderer();

renderer.blockquote = (quote)=> quote;
renderer.heading = (text)=> text;
renderer.hr = ()=> '';
renderer.list = (body)=> body;
renderer.listitem = (text)=> text;
renderer.paragraph = (text)=> `<span>${text}</span>`;

marked.setOptions({
  renderer: renderer
});

export default marked;
