import { useLocation, useParams } from 'react-router-dom';
import ApiForm from '../components/ApiForm';

const DynamicFormPage = () => {
  const decodeEndpoint = (encoded: string) => encoded.replace('__', '/');
  const { entity, id } = useParams();
  const { state } = useLocation();
  const formTemplate = state?.formTemplate || [];
  const decodedEndpoint = decodeEndpoint(entity || '');

  return (
    <ApiForm
      formName={decodedEndpoint}
      endPoint={decodedEndpoint}
      isNew={id === 'new'}
      children={formTemplate}
    />
  );
};

export default DynamicFormPage;