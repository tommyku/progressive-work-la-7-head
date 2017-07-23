import marked from 'marked';

const renderer = new marked.Renderer();

renderer.blockquote = (quote)=> quote;
renderer.heading = (text)=> text;
renderer.hr = ()=> '';
renderer.list = (body)=> body;
renderer.listitem = (text)=> text;
renderer.paragraph = (text)=> `<p style='margin: 0.5em 0;'>${text}</p>`;

export default renderer;
