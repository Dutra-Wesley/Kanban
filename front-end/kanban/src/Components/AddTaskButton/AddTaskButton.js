import React from 'react';
import './AddTaskButton.css';

import { ReactComponent as AddIcon } from '../../Imgs/Add.svg';
import { ReactComponent as EditIcon } from '../../Imgs/Edit.svg';
import { ReactComponent as DeleteIcon } from '../../Imgs/Delete.svg';
import { ReactComponent as RestoreIcon } from '../../Imgs/Restore.svg';

const AddTaskButton = ({ size, iconName, onClick }) => {
    const Icon = {
        add: AddIcon,
        edit: EditIcon,
        delete: DeleteIcon,
        restore: RestoreIcon,
    }[iconName];

    return (
        <button className={`add-task-button ${size}`} onClick={onClick}>
            <Icon />
        </button>
    );
};

export default AddTaskButton;
