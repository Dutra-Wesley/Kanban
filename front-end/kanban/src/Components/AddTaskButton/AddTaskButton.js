import React from 'react';
import './AddTaskButton.css';

import { ReactComponent as AddIcon } from '../../Imgs/Add.svg';
import { ReactComponent as EditIcon } from '../../Imgs/Edit.svg';
import { ReactComponent as DeleteIcon } from '../../Imgs/Delete.svg';

const AddTaskButton = ({ size, iconName, onClick }) => {
    const Icon = {
        add: AddIcon,
        edit: EditIcon,
        delete: DeleteIcon,
    }[iconName];

    return (
        <button className={`add-task-button ${size}`} onClick={onClick}>
            <Icon />
        </button>
    );
};

export default AddTaskButton;
