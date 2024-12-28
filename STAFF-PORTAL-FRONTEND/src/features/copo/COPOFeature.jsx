import { useState } from 'react';
import { useNavigation } from '../../contexts/NavigationContext';
import { FiUpload, FiDownload, FiBarChart2, FiLayers, FiFile } from 'react-icons/fi';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const InternalAssessment = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Internal Assessment</h2>
        <Button variant="secondary" icon={<FiDownload />}>
          Download Template
        </Button>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Upload Internal Marks</h3>
          <div className="space-y-2">
            <input
              type="file"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            {selectedFile && (
              <p className="text-sm text-gray-600">
                Selected file: {selectedFile.name}
              </p>
            )}
          </div>
          <Button variant="primary" icon={<FiUpload />} disabled={!selectedFile}>
            Process Internal Marks
          </Button>
        </div>
      </Card>
    </div>
  );
};

const HighLevelMapping = () => {
  const [mapping, setMapping] = useState({
    cos: ['CO1', 'CO2', 'CO3', 'CO4', 'CO5'],
    pos: ['PO1', 'PO2', 'PO3', 'PO4', 'PO5', 'PO6'],
    matrix: [
      [3, 2, 1, 0, 2, 1],
      [2, 3, 2, 1, 0, 2],
      [1, 2, 3, 2, 1, 0],
      [0, 1, 2, 3, 2, 1],
      [2, 0, 1, 2, 3, 2],
    ],
  });

  const strengthLevels = {
    0: 'None',
    1: 'Low',
    2: 'Medium',
    3: 'High',
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">CO-PO Mapping Matrix</h2>
      <Card className="p-6 overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-4 py-2"></th>
              {mapping.pos.map((po) => (
                <th key={po} className="px-4 py-2 text-center">{po}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mapping.cos.map((co, i) => (
              <tr key={co}>
                <td className="px-4 py-2 font-medium">{co}</td>
                {mapping.matrix[i].map((value, j) => (
                  <td key={j} className="px-4 py-2 text-center">
                    <select
                      value={value}
                      onChange={(e) => {
                        const newMatrix = [...mapping.matrix];
                        newMatrix[i][j] = parseInt(e.target.value);
                        setMapping({ ...mapping, matrix: newMatrix });
                      }}
                      className="border rounded p-1"
                    >
                      {Object.entries(strengthLevels).map(([val, label]) => (
                        <option key={val} value={val}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <div className="flex justify-end space-x-4">
        <Button variant="secondary" icon={<FiDownload />}>
          Download Matrix
        </Button>
        <Button variant="primary" icon={<FiUpload />}>
          Save Mapping
        </Button>
      </div>
    </div>
  );
};

const DetailedAnalysis = () => {
  const analysisData = [
    {
      type: 'Internal Assessment',
      status: 'Completed',
      date: '2023-12-20',
      score: 85,
    },
    {
      type: 'Assignment Evaluation',
      status: 'Completed',
      date: '2023-12-22',
      score: 78,
    },
    {
      type: 'Lab Performance',
      status: 'Pending',
      date: '-',
      score: null,
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Detailed CO-PO Analysis</h2>
      <div className="grid gap-4">
        {analysisData.map((item) => (
          <Card key={item.type} className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">{item.type}</h3>
                <p className="text-sm text-gray-600">Status: {item.status}</p>
                {item.date !== '-' && (
                  <p className="text-sm text-gray-600">Date: {item.date}</p>
                )}
              </div>
              {item.score !== null && (
                <div className="text-xl font-bold text-blue-600">
                  {item.score}%
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
      <Button variant="primary" icon={<FiBarChart2 />}>
        Generate Complete Analysis
      </Button>
    </div>
  );
};

const Reports = () => {
  const reports = [
    {
      id: 1,
      name: 'CO Attainment Report',
      date: '2023-12-25',
      type: 'Excel',
      size: '2.5 MB',
    },
    {
      id: 2,
      name: 'PO Assessment Summary',
      date: '2023-12-25',
      type: 'PDF',
      size: '1.8 MB',
    },
    {
      id: 3,
      name: 'Detailed Analysis Report',
      date: '2023-12-24',
      type: 'Excel',
      size: '3.2 MB',
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Generated Reports</h2>
      <div className="grid gap-4">
        {reports.map((report) => (
          <Card key={report.id} className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">{report.name}</h3>
                <p className="text-sm text-gray-600">
                  Generated on: {report.date}
                </p>
                <p className="text-sm text-gray-600">
                  Type: {report.type} | Size: {report.size}
                </p>
              </div>
              <Button variant="secondary" icon={<FiDownload />}>
                Download
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const Templates = () => {
  const templates = [
    {
      id: 1,
      name: 'Internal Assessment Template',
      description: 'Template for uploading internal marks',
      type: 'Excel',
    },
    {
      id: 2,
      name: 'CO-PO Mapping Template',
      description: 'Standard template for CO-PO mapping matrix',
      type: 'Excel',
    },
    {
      id: 3,
      name: 'Lab Assessment Template',
      description: 'Template for lab performance evaluation',
      type: 'Excel',
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Templates</h2>
      <div className="grid gap-4">
        {templates.map((template) => (
          <Card key={template.id} className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">{template.name}</h3>
                <p className="text-sm text-gray-600">{template.description}</p>
                <p className="text-sm text-gray-600">Format: {template.type}</p>
              </div>
              <div className="space-x-2">
                <Button variant="secondary" icon={<FiDownload />}>
                  Download
                </Button>
                <Button variant="primary" icon={<FiUpload />}>
                  Upload Filled
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default function COPOFeature() {
  const { currentSection } = useNavigation();

  const renderSection = () => {
    switch (currentSection) {
      case 'internal-assessment':
        return <InternalAssessment />;
      case 'high-level-mapping':
        return <HighLevelMapping />;
      case 'detailed-analysis':
        return <DetailedAnalysis />;
      case 'reports':
        return <Reports />;
      case 'templates':
        return <Templates />;
      default:
        return <InternalAssessment />;
    }
  };

  return (
    <div className="space-y-6">
      {renderSection()}
    </div>
  );
}
