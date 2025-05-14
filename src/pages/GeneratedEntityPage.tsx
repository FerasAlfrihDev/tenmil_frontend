import { FC } from 'react';
import { useParams } from 'react-router';
import ApiForm from '../components/ApiForm';
import ApiTabs from '../components/ApiTabs';
import { TabProps } from '../types/ApiTabsTypes';

interface GeneratedEntityPageProps {
  entityName: string;
  endPoint: string;
  formFields: any[];
  tabs?: TabProps[];
}

const GeneratedEntityPage: FC<GeneratedEntityPageProps> = ({
  entityName,
  endPoint,
  formFields,
  tabs = []
}) => {
  const params = useParams();
  const isNew = params.id === 'new';

  return (
    <div className="flex-vertical main-content">
      <ApiForm
        formName={entityName}
        isNew={isNew}
        endPoint={endPoint}
        oriantation="horizontal"
        children={formFields}
        formTemplate={formFields}
      />

      {tabs.length > 0 && (
        <ApiTabs
          activeKey={tabs[0].tabKey}
          tabs={tabs}
          className="main-content"
          disabled={isNew}
          intityName={entityName}
        />
      )}
    </div>
  );
};

export default GeneratedEntityPage;
