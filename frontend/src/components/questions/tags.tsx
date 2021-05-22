import React from 'react';

interface Props {
    tags: string[];
}

export default function Tags(props: Props): JSX.Element {
  const { tags } = props;

  return (
    <div>
      {tags ? (
        <div>
          {tags.map((tag: string, i: number) => (
            // eslint-disable-next-line react/no-array-index-key
            <div key={i} className="badge badge-secondary" style={{ marginRight: '5px' }}>
              <span>{tag}</span>
            </div>
          ))}
        </div>
      ) : null }
    </div>
  );
}
