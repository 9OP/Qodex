/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react';

// font awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

interface InputTagBarProps {
  handleAddTag: (value: string) => void;
}

function InputTagBar(props: InputTagBarProps): JSX.Element {
  const [value, setValue] = useState('');
  const { handleAddTag } = props;

  const handleSubmit = (evt: React.KeyboardEvent): void => {
    if (evt.keyCode === 13 || evt.keyCode === 32) { // Enter or Spacebar
      if (value.replace(/\s/g, '') !== '') {
        handleAddTag(value);
      }
      setValue('');
    }
  };

  return (
    <input
      className="form-control form-control-sm"
      placeholder="tag ..."
      name="value"
      value={value}
      onChange={(e): void => setValue(e.target.value)}
      onKeyDown={handleSubmit}
    />
  );
}

interface ListTagBarProps {
  tags: string[];
  handleDeleteTag: (tag: string) => void;
}

const tagStyle = {
  margin: '0 2px',
  padding: '2px 3px',
};

function ListTagBar(props: ListTagBarProps): JSX.Element {
  const { tags } = props;
  const { handleDeleteTag } = props;

  return (
    <div>
      {tags.map((tag: string, i: number): JSX.Element => (
        <div key={i} className="badge badge-primary" style={tagStyle}>
          <span style={{ padding: '0  5px' }}>{tag}</span>
          <FontAwesomeIcon className="icon" icon={faTimes} onClick={(): void => handleDeleteTag(tag)} />
        </div>
      ))}
    </div>
  );
}

interface TagBarProps {
  updateTags: (tags: string[]) => void;
}

export default function TagBar(props: TagBarProps): JSX.Element {
  const [tags, setTags] = useState<string[]>([]);
  const { updateTags } = props;

  const addTag = (value: string): void => {
    tags.push(value);
    setTags([...tags]);
    updateTags([...tags]);
  };

  const deleteTag = (tag: string): void => {
    const index = tags.indexOf(tag, 0);
    if (index > -1) { tags.splice(index, 1); }
    setTags([...tags]);
    updateTags([...tags]);
  };

  return (
    <div>
      <InputTagBar handleAddTag={addTag} />
      <ListTagBar tags={tags} handleDeleteTag={deleteTag} />
    </div>
  );
}
