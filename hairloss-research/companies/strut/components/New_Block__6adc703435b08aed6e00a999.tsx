export default function MyComponent({ title, backgroundColor }: {
  title: string;
  backgroundColor: string;
}) {
  return (
    <div style={{ padding: '20px', backgroundColor, borderRadius: '8px' }}>
      <h1 style={{ margin: 0 }}>{title}</h1>
    </div>
  );
}

export const propSchema = {
  title: {
    type: 'string',
    title: 'Title',
    defaultValue: 'Hello World',
  },
  backgroundColor: {
    type: 'color',
    title: 'Background Color',
    defaultValue: '#f0f0f0',
  },
};
