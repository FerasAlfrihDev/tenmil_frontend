import { useLocation, useParams } from 'react-router-dom';
import ApiForm from '../components/ApiForm';

const DynamicFormPage = () => {
  const { entity, id } = useParams();
  const { state } = useLocation();
  const formTemplate = state?.formTemplate || [];

  return (
    <ApiForm
      formName={entity || 'Form'}
      endPoint={entity!}
      isNew={id === 'new'}
      children={formTemplate}
    />
  );
};

export default DynamicFormPage;