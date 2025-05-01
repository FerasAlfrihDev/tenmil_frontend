import { useLocation, useParams } from 'react-router-dom';
import ApiForm from '../components/ApiForm';

const DynamicFormPage = () => {
  const { state } = useLocation();
  const formTemplate = state?.formTemplate || [];
  const decodeEndpoint = (encoded: string) => encoded.replace('__', '/');
  const { encodedEntity, id } = useParams();
  const decodedEndpoint = decodeEndpoint(encodedEntity || '');

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