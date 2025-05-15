import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import ApiForm from '../components/ApiForm';

const DynamicFormPage = () => {
  const { state } = useLocation();
  const formTemplate = state?.formTemplate || [];
  const decodeEndpoint = (encoded: string) => encoded.replace('__', '/');
  const { encodedEntity, id } = useParams();
  const decodedEndpoint = decodeEndpoint(encodedEntity || '');
  const [searchParams] = useSearchParams();
  const isViewOnly = searchParams.get('viewOnly') === 'true';

  return (    
    <ApiForm
      formName={decodedEndpoint}
      endPoint={decodedEndpoint}
      isNew={id === 'new'}
      children={formTemplate}
      viewOnly={isViewOnly}
      formTemplate={formTemplate}
    />
  );
};

export default DynamicFormPage;