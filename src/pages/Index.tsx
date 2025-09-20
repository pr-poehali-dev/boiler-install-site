import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Icon from "@/components/ui/icon";
import { useState } from "react";

export default function Index() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedInstallation, setSelectedInstallation] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedInstallation, setEditedInstallation] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    dateFrom: '',
    dateTo: '',
    boilerType: '',
    region: '',
    workStatus: '',
    searchField: 'all'
  });

  // Функции для редактирования
  const startEditing = (installation: any) => {
    setEditedInstallation({ ...installation });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setEditedInstallation(null);
    setIsEditing(false);
  };

  const saveChanges = () => {
    if (!editedInstallation) return;
    
    // Обновляем данные в массиве
    const updatedData = allData.map(item => 
      item.id === editedInstallation.id ? editedInstallation : item
    );
    
    setSelectedInstallation(editedInstallation);
    setIsEditing(false);
    setEditedInstallation(null);
    
    // Здесь можно добавить сохранение в базу данных
    console.log('Сохранены изменения:', editedInstallation);
  };

  // Функции для массовых действий
  const toggleSelectAll = () => {
    if (selectedIds.size === filteredData.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredData.map(item => item.id)));
    }
  };

  const toggleSelectItem = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const bulkUpdateStatus = (newStatus: string) => {
    if (selectedIds.size === 0) return;
    
    // Здесь должно быть обновление в базе данных
    console.log(`Обновляем статус у ${selectedIds.size} заявок на: ${newStatus}`);
    
    // Очищаем выбор
    setSelectedIds(new Set());
    setShowBulkActions(false);
  };

  // Улучшенная фильтрация
  const applyAdvancedFilter = (item: any) => {
    // Фильтр по датам
    if (advancedFilters.dateFrom) {
      const itemDate = new Date(item.orderDate);
      const fromDate = new Date(advancedFilters.dateFrom);
      if (itemDate < fromDate) return false;
    }
    
    if (advancedFilters.dateTo) {
      const itemDate = new Date(item.orderDate);
      const toDate = new Date(advancedFilters.dateTo);
      if (itemDate > toDate) return false;
    }

    // Фильтр по типу котла
    if (advancedFilters.boilerType && advancedFilters.boilerType !== 'all') {
      if (item.boilerType !== advancedFilters.boilerType) return false;
    }

    // Фильтр по региону
    if (advancedFilters.region && advancedFilters.region !== 'all') {
      if (!item.client?.address?.toLowerCase().includes(advancedFilters.region.toLowerCase())) return false;
    }

    // Фильтр по статусу работ
    if (advancedFilters.workStatus && advancedFilters.workStatus !== 'all') {
      if (item.client?.workCompletionStatus !== advancedFilters.workStatus) return false;
    }

    return true;
  };

  // Улучшенный поиск
  const applySearch = (item: any) => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    
    switch (advancedFilters.searchField) {
      case 'name':
        return item.client?.fullName?.toLowerCase().includes(query);
      case 'phone':
        return item.client?.phone?.includes(query);
      case 'address':
        return item.client?.address?.toLowerCase().includes(query);
      case 'cadastral':
        return item.client?.cadastralNumber?.includes(query);
      default: // 'all'
        return (
          item.client?.fullName?.toLowerCase().includes(query) ||
          item.client?.phone?.includes(query) ||
          item.client?.address?.toLowerCase().includes(query) ||
          item.client?.cadastralNumber?.includes(query) ||
          item.boilerType?.toLowerCase().includes(query)
        );
    }
  };

  const updateField = (path: string, value: any) => {
    if (!editedInstallation) return;
    
    const pathArray = path.split('.');
    const updatedInstallation = { ...editedInstallation };
    
    let current = updatedInstallation;
    for (let i = 0; i < pathArray.length - 1; i++) {
      if (!current[pathArray[i]]) current[pathArray[i]] = {};
      current = current[pathArray[i]];
    }
    current[pathArray[pathArray.length - 1]] = value;
    
    setEditedInstallation(updatedInstallation);
  };

  // Компонент для редактируемого поля
  const EditableField = ({ label, path, type = "text", options = null, isTextarea = false }: {
    label: string;
    path: string;
    type?: string;
    options?: Array<{value: string, label: string}> | null;
    isTextarea?: boolean;
  }) => {
    const currentInstallation = isEditing ? editedInstallation : selectedInstallation;
    if (!currentInstallation) return null;

    const getValue = (obj: any, path: string) => {
      return path.split('.').reduce((o, p) => o?.[p], obj) || '';
    };

    const value = getValue(currentInstallation, path);

    if (!isEditing) {
      return (
        <div>
          <Label className="text-sm font-medium">{label}</Label>
          <Input value={value || '-'} readOnly />
        </div>
      );
    }

    if (options) {
      return (
        <div>
          <Label className="text-sm font-medium">{label}</Label>
          <Select value={value} onValueChange={(val) => updateField(path, val)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {options.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }

    if (type === "boolean") {
      return (
        <div>
          <Label className="text-sm font-medium">{label}</Label>
          <Select value={value ? "true" : "false"} onValueChange={(val) => updateField(path, val === "true")}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Да</SelectItem>
              <SelectItem value="false">Нет</SelectItem>
            </SelectContent>
          </Select>
        </div>
      );
    }

    if (isTextarea) {
      return (
        <div>
          <Label className="text-sm font-medium">{label}</Label>
          <Textarea 
            value={value} 
            onChange={(e) => updateField(path, e.target.value)}
            rows={2}
          />
        </div>
      );
    }

    return (
      <div>
        <Label className="text-sm font-medium">{label}</Label>
        <Input 
          type={type}
          value={value} 
          onChange={(e) => updateField(path, type === "number" ? Number(e.target.value) : e.target.value)}
        />
      </div>
    );
  };

  const allData = [
    // Установленные котлы
    {
      id: "BLR-001",
      address: "ул. Ленина, 15",
      client: {
        fullName: "Смирнов Олег Петрович",
        phone: "+7 (999) 111-11-11",
        additionalPhone: "+7 (999) 111-22-33",
        email: "smirnov@example.com",
        passport: "1111 111111",
        inn: "111111111111",
        region: "Московская область",
        city: "Подольск",
        district: "Центральный",
        street: "ул. Ленина",
        house: "15",
        agreement: true,
        separateBoilerRoom: true,
        houseBuiltBefore2018: false,
        workCompletionStatus: "completed",
        applicationComment: "Стандартная установка",
        surveyorStatus: "completed",
        surveyorComment: "Все готово для установки",
        plannedSurveyDate: "2024-01-08",
        applicationCreatedDate: "2024-01-05",
        actualSurveyDate: "2024-01-10",
        visitStatus: "completed",
        cadastralNumber: "50:21:0030105:123",
        ownersCount: 1,
        actualHouseArea: 120,
        heatedArea: 100,
        houseCommissioningDate: "2020-05-15",
        ownersReadiness: "ready",
        ecoHeatingYear: 2024,
        conversionType: "gas",
        wallMaterial: "brick",
        floors: 2,
        boilerRoomLocation: "basement",
        boilerRoomCeilingMaterial: "concrete",
        boilerRoomFloorMaterial: "concrete",
        boilerRoomWallMaterial: "brick",
        boilerBrandModel: "Vaillant turboTEC plus VU 242/5-5",
        nominalPower: 24,
        supplyVentilation: true,
        windowsInBoilerRoom: true,
        doorsInBoilerRoom: true,
        fireAlarmAndSensor: true,
        power220Point: "available",
        distanceTo220: 3,
        outputCircuits: 2,
        circulationPump: true,
        coldWaterConnection: "available",
        distanceToColdWater: 2,
        coolantFillingMethod: "pressure",
        chimneyType: "coaxial",
        chimneyDiameter: 60,
        chimneyElbows: 2,
        chimneyLength: 5,
        ceilingHeight: 2.5,
        roomLength: 4,
        roomWidth: 3,
        roomArea: 12,
        aitType: "individual",
        fuelType: "natural_gas",
        heatingSystem: "radiator",
        yandexDiskLink: "https://disk.yandex.ru/...",
        fillingDate: "2024-01-10",
        glazing: "double",
        insulation: true,
        houseCeilingHeight: 2.7,
        glazingArea: 25,
        panoramicGlazing: false,
        houseWallMaterial: "brick",
        houseSupplyVentilation: false,
        heatingSystemType: "closed",
        pipeConnectionDiameter: 25
      },
      status: "active",
      temp: 72,
      lastService: "2024-08-15",
      boilerType: "Котел газовый 24кВт",
      type: "existing",
      progress: 100,
      orderDate: "2024-01-10",
      plannedDate: "2024-02-15",
      documents: ["warranty.pdf", "manual.pdf"],
      photos: ["completed_1.jpg", "completed_2.jpg"]
    },
    {
      id: "BLR-002",
      address: "пр. Победы, 32",
      client: {
        fullName: "Волкова Елена Александровна",
        phone: "+7 (999) 222-22-22",
        email: "volkova@example.com",
        passport: "2222 222222",
        inn: "222222222222"
      },
      status: "maintenance",
      temp: 45,
      lastService: "2024-09-01",
      boilerType: "Котел конденсационный 20кВт",
      type: "existing",
      progress: 100,
      orderDate: "2024-02-05",
      plannedDate: "2024-03-12",
      documents: ["warranty.pdf", "service_log.pdf"],
      photos: ["maintenance_1.jpg"]
    },
    {
      id: "BLR-003",
      address: "ул. Гагарина, 8",
      client: {
        fullName: "Морозов Андрей Викторович",
        phone: "+7 (999) 333-33-33",
        email: "morozov@example.com",
        passport: "3333 333333",
        inn: "333333333333"
      },
      status: "offline",
      temp: 0,
      lastService: "2024-07-20",
      boilerType: "Котел электрический 18кВт",
      type: "existing",
      progress: 100,
      orderDate: "2024-01-15",
      plannedDate: "2024-02-28",
      documents: ["warranty.pdf"],
      photos: ["offline_issue.jpg"]
    },
    {
      id: "BLR-004",
      address: "ул. Мира, 45",
      client: {
        fullName: "Федоров Дмитрий Сергеевич",
        phone: "+7 (999) 444-44-44",
        email: "fedorov@example.com",
        passport: "4444 444444",
        inn: "444444444444"
      },
      status: "active",
      temp: 68,
      lastService: "2024-08-28",
      boilerType: "Котел газовый 30кВт",
      type: "existing",
      progress: 100,
      orderDate: "2024-03-01",
      plannedDate: "2024-04-10",
      documents: ["warranty.pdf", "manual.pdf", "certificate.pdf"],
      photos: ["completed_1.jpg", "completed_2.jpg"]
    },
    {
      id: "BLR-005",
      address: "ул. Советская, 12",
      client: {
        fullName: "Кузнецова Ирина Владимировна",
        phone: "+7 (999) 555-55-55",
        email: "kuznetsova@example.com",
        passport: "5555 555555",
        inn: "555555555555"
      },
      status: "warning",
      temp: 85,
      lastService: "2024-09-10",
      boilerType: "Котел комбинированный 25кВт",
      type: "existing",
      progress: 100,
      orderDate: "2024-02-15",
      plannedDate: "2024-03-25",
      documents: ["warranty.pdf", "service_alert.pdf"],
      photos: ["warning_temp.jpg"]
    },
    // Новые установки в процессе
    {
      id: "INS-001",
      address: "ул. Новая, 25",
      client: {
        fullName: "Иванов Иван Иванович",
        phone: "+7 (999) 123-45-67",
        email: "ivanov@example.com",
        passport: "1234 567890",
        inn: "123456789012"
      },
      status: "quotation",
      orderDate: "2024-09-15",
      plannedDate: "2024-09-25",
      boilerType: "Котел газовый 24кВт",
      progress: 10,
      type: "installation",
      documents: ["quotation.pdf"],
      photos: []
    },
    {
      id: "INS-002",
      address: "ул. Строителей, 12",
      client: {
        fullName: "Петрова Марина Сергеевна",
        phone: "+7 (999) 234-56-78",
        email: "petrova@example.com",
        passport: "2345 678901",
        inn: "234567890123"
      },
      status: "production",
      orderDate: "2024-09-10",
      plannedDate: "2024-09-22",
      boilerType: "Котел конденсационный 28кВт",
      progress: 30,
      type: "installation",
      documents: ["contract.pdf", "technical_spec.pdf"],
      photos: []
    },
    {
      id: "INS-003",
      address: "ул. Парковая, 67",
      client: {
        fullName: "Николаев Сергей Михайлович",
        phone: "+7 (999) 666-66-66",
        email: "nikolaev@example.com",
        passport: "6666 666666",
        inn: "666666666666"
      },
      status: "delivery",
      orderDate: "2024-09-08",
      plannedDate: "2024-09-20",
      boilerType: "Котел электрический 22кВт",
      progress: 60,
      type: "installation",
      documents: ["contract.pdf", "passport_copy.pdf"],
      photos: ["site_before_1.jpg"]
    },
    {
      id: "INS-004",
      address: "пр. Мира, 88",
      client: {
        fullName: "Сидоров Петр Алексеевич",
        phone: "+7 (999) 345-67-89",
        email: "sidorov@example.com",
        passport: "3456 789012",
        inn: "345678901234"
      },
      status: "installation",
      orderDate: "2024-09-05",
      plannedDate: "2024-09-20",
      boilerType: "Котел электрический 15кВт",
      progress: 85,
      type: "installation",
      documents: ["contract.pdf", "installation_permit.pdf"],
      photos: ["site_before_1.jpg", "installation_1.jpg", "installation_2.jpg"]
    },
    {
      id: "INS-005",
      address: "ул. Садовая, 45",
      client: {
        fullName: "Козлова Анна Дмитриевна",
        phone: "+7 (999) 456-78-90",
        email: "kozlova@example.com",
        passport: "4567 890123",
        inn: "456789012345"
      },
      status: "testing",
      orderDate: "2024-08-20",
      plannedDate: "2024-09-15",
      boilerType: "Котел комбинированный 32кВт",
      progress: 95,
      type: "installation",
      documents: ["contract.pdf", "installation_act.pdf"],
      photos: ["site_before_1.jpg", "installation_1.jpg", "testing_1.jpg"]
    },
    {
      id: "INS-006",
      address: "ул. Весенняя, 18",
      client: {
        fullName: "Романов Алексей Игоревич",
        phone: "+7 (999) 777-77-77",
        email: "romanov@example.com",
        passport: "7777 777777",
        inn: "777777777777"
      },
      status: "completed",
      orderDate: "2024-08-15",
      plannedDate: "2024-09-10",
      boilerType: "Котел газовый 26кВт",
      progress: 100,
      type: "installation",
      documents: ["contract.pdf", "completion_act.pdf", "warranty.pdf"],
      photos: ["site_before_1.jpg", "installation_1.jpg", "completed_1.jpg", "completed_2.jpg"]
    },
    {
      id: "INS-007",
      address: "пр. Космонавтов, 15",
      client: {
        fullName: "Белова Татьяна Николаевна",
        phone: "+7 (999) 888-88-88",
        email: "belova@example.com",
        passport: "8888 888888",
        inn: "888888888888"
      },
      status: "canceled",
      orderDate: "2024-09-12",
      plannedDate: "2024-09-30",
      boilerType: "Котел конденсационный 30кВт",
      progress: 5,
      type: "installation",
      documents: ["quotation.pdf", "cancel_notice.pdf"],
      photos: []
    }
  ];

  // Фильтрация данных
  const filteredData = allData.filter(item => {
    // Применяем поиск
    if (!applySearch(item)) return false;
    
    // Применяем стандартные фильтры
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    
    // Применяем расширенные фильтры
    if (!applyAdvancedFilter(item)) return false;
    
    return matchesStatus && matchesType;
  });



  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "warning": return "bg-yellow-500";
      case "maintenance": return "bg-blue-500";
      case "offline": return "bg-red-500";
      case "quotation": return "bg-cyan-500";
      case "production": return "bg-orange-500";
      case "delivery": return "bg-indigo-500";
      case "installation": return "bg-purple-500";
      case "testing": return "bg-amber-500";
      case "completed": return "bg-green-600";
      case "canceled": return "bg-gray-500";
      default: return "bg-gray-400";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active": return "Активен";
      case "warning": return "Предупреждение";
      case "maintenance": return "Обслуживание";
      case "offline": return "Отключен";
      case "quotation": return "Коммерческое предложение";
      case "production": return "Производство";
      case "delivery": return "Доставка";
      case "installation": return "Монтаж";
      case "testing": return "Тестирование";
      case "completed": return "Завершен";
      case "canceled": return "Отменен";
      default: return "Неизвестно";
    }
  };

  const activeBoilers = allData.filter(b => b.status === "active").length;
  const maintenanceBoilers = allData.filter(b => b.status === "maintenance").length;
  const warningBoilers = allData.filter(b => b.status === "warning").length;
  const offlineBoilers = allData.filter(b => b.status === "offline").length;
  const completedInstallations = allData.filter(b => b.status === "completed").length;
  const activeInstallations = allData.filter(b => b.type === "installation" && !['completed', 'canceled'].includes(b.status)).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center space-x-4">
            <Icon name="Flame" size={24} className="text-primary" />
            <h1 className="text-xl font-semibold">Система управления котлами</h1>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Icon name="Bell" size={16} className="mr-2" />
              Уведомления
            </Button>
            <Button variant="outline" size="sm">
              <Icon name="Settings" size={16} className="mr-2" />
              Настройки
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-card h-[calc(100vh-64px)]">
          <nav className="p-4 space-y-2">
            <Button variant="default" className="w-full justify-start">
              <Icon name="LayoutDashboard" size={16} className="mr-2" />
              Дашборд
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Icon name="Flame" size={16} className="mr-2" />
              Котлы
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Icon name="MapPin" size={16} className="mr-2" />
              Карта установок
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Icon name="Calendar" size={16} className="mr-2" />
              Планировщик
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Icon name="ClipboardList" size={16} className="mr-2" />
              Задачи
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Icon name="FileText" size={16} className="mr-2" />
              Документы
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Icon name="BarChart3" size={16} className="mr-2" />
              Отчеты
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Icon name="Archive" size={16} className="mr-2" />
              Архив
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Всего котлов</CardTitle>
                  <Icon name="Flame" size={16} className="text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{allData.length}</div>
                  <p className="text-xs text-muted-foreground">+2 с прошлого месяца</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Активных</CardTitle>
                  <Icon name="CheckCircle" size={16} className="text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-500">{activeBoilers}</div>
                  <p className="text-xs text-muted-foreground">Работают штатно</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">На обслуживании</CardTitle>
                  <Icon name="Wrench" size={16} className="text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-500">{maintenanceBoilers}</div>
                  <p className="text-xs text-muted-foreground">Плановое ТО</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Требуют внимания</CardTitle>
                  <Icon name="AlertTriangle" size={16} className="text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-500">{warningBoilers + offlineBoilers}</div>
                  <p className="text-xs text-muted-foreground">Проблемы или отключены</p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Обзор</TabsTrigger>
                <TabsTrigger value="management">Управление котлами</TabsTrigger>
                <TabsTrigger value="calendar">Календарь</TabsTrigger>
                <TabsTrigger value="map">Карта</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Status Overview */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Общее состояние системы</CardTitle>
                      <CardDescription>Текущий статус всех установок</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Эффективность работы</span>
                          <span className="text-sm text-muted-foreground">92%</span>
                        </div>
                        <Progress value={92} className="h-2" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 pt-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-sm">Активных: {activeBoilers}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span className="text-sm">На ТО: {maintenanceBoilers}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <span className="text-sm">Предупреждения: {warningBoilers}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <span className="text-sm">Отключены: {offlineBoilers}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Activity */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Последние события</CardTitle>
                      <CardDescription>Недавние изменения и уведомления</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <Icon name="CheckCircle" size={16} className="text-green-500 mt-0.5" />
                          <div className="space-y-1">
                            <p className="text-sm font-medium">Котел BLR-004 прошел ТО</p>
                            <p className="text-xs text-muted-foreground">2 часа назад</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Icon name="AlertTriangle" size={16} className="text-yellow-500 mt-0.5" />
                          <div className="space-y-1">
                            <p className="text-sm font-medium">Превышение температуры BLR-005</p>
                            <p className="text-xs text-muted-foreground">4 часа назад</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Icon name="Wrench" size={16} className="text-blue-500 mt-0.5" />
                          <div className="space-y-1">
                            <p className="text-sm font-medium">Запланировано ТО для BLR-002</p>
                            <p className="text-xs text-muted-foreground">Вчера</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="management" className="space-y-4">
                {/* Поиск и фильтры */}
                <Card>
                  <CardHeader>
                    <CardTitle>Поиск и фильтры</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Основной поиск */}
                    <div className="flex space-x-2">
                      <div className="relative flex-1">
                        <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Поиск..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <Select 
                        value={advancedFilters.searchField} 
                        onValueChange={(value) => setAdvancedFilters(prev => ({...prev, searchField: value}))}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Все поля</SelectItem>
                          <SelectItem value="name">Имя клиента</SelectItem>
                          <SelectItem value="phone">Телефон</SelectItem>
                          <SelectItem value="address">Адрес</SelectItem>
                          <SelectItem value="cadastral">Кадастр</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Основные фильтры */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Статус заявки" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Все статусы</SelectItem>
                          <SelectItem value="new">Новые</SelectItem>
                          <SelectItem value="pending">В ожидании</SelectItem>
                          <SelectItem value="approved">Одобрены</SelectItem>
                          <SelectItem value="in_progress">В работе</SelectItem>
                          <SelectItem value="testing">Тестирование</SelectItem>
                          <SelectItem value="completed">Завершены</SelectItem>
                          <SelectItem value="canceled">Отменены</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Тип объекта" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Все объекты</SelectItem>
                          <SelectItem value="existing">Установленные котлы</SelectItem>
                          <SelectItem value="installation">Новые установки</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select 
                        value={advancedFilters.boilerType} 
                        onValueChange={(value) => setAdvancedFilters(prev => ({...prev, boilerType: value}))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Тип котла" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Все типы</SelectItem>
                          <SelectItem value="газовый">Газовый</SelectItem>
                          <SelectItem value="электрический">Электрический</SelectItem>
                          <SelectItem value="твердотопливный">Твердотопливный</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Расширенные фильтры */}
                    <details className="space-y-4">
                      <summary className="cursor-pointer text-sm font-medium text-primary hover:text-primary/80">
                        Расширенные фильтры
                      </summary>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                        <div>
                          <Label className="text-sm">Дата от</Label>
                          <Input
                            type="date"
                            value={advancedFilters.dateFrom}
                            onChange={(e) => setAdvancedFilters(prev => ({...prev, dateFrom: e.target.value}))}
                          />
                        </div>
                        <div>
                          <Label className="text-sm">Дата до</Label>
                          <Input
                            type="date"
                            value={advancedFilters.dateTo}
                            onChange={(e) => setAdvancedFilters(prev => ({...prev, dateTo: e.target.value}))}
                          />
                        </div>
                        <Select 
                          value={advancedFilters.workStatus} 
                          onValueChange={(value) => setAdvancedFilters(prev => ({...prev, workStatus: value}))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Статус работ" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Все статусы</SelectItem>
                            <SelectItem value="pending">В ожидании</SelectItem>
                            <SelectItem value="in_progress">В работе</SelectItem>
                            <SelectItem value="completed">Завершена</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </details>
                    
                    <div className="flex justify-between items-center">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSearchQuery('');
                          setStatusFilter('all');
                          setTypeFilter('all');
                          setAdvancedFilters({
                            dateFrom: '',
                            dateTo: '',
                            boilerType: 'all',
                            region: '',
                            workStatus: 'all',
                            searchField: 'all'
                          });
                          setSelectedIds(new Set());
                        }}
                      >
                        <Icon name="X" size={16} className="mr-1" />
                        Очистить все
                      </Button>
                      
                      <div className="text-sm text-muted-foreground">
                        Найдено: {filteredData.length} из {allData.length} объектов
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Панель массовых действий */}
                {selectedIds.size > 0 && (
                  <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Icon name="CheckSquare" size={16} className="text-primary" />
                          <span className="text-sm font-medium">
                            Выбрано: {selectedIds.size} заявок
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Select onValueChange={(value) => bulkUpdateStatus(value)}>
                            <SelectTrigger className="w-[200px]">
                              <SelectValue placeholder="Изменить статус" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">Новые</SelectItem>
                              <SelectItem value="pending">В ожидании</SelectItem>
                              <SelectItem value="approved">Одобрены</SelectItem>
                              <SelectItem value="in_progress">В работе</SelectItem>
                              <SelectItem value="testing">Тестирование</SelectItem>
                              <SelectItem value="completed">Завершены</SelectItem>
                              <SelectItem value="canceled">Отменены</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedIds(new Set())}
                          >
                            <Icon name="X" size={16} className="mr-1" />
                            Отменить выбор
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Основная таблица */}
                <Card>
                  <CardHeader>
                    <CardTitle>Управление котлами и установками</CardTitle>
                    <CardDescription>Полный контроль существующих котлов и новых установок</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px]">
                            <input
                              type="checkbox"
                              checked={selectedIds.size === filteredData.length && filteredData.length > 0}
                              onChange={toggleSelectAll}
                              className="rounded border-gray-300"
                            />
                          </TableHead>
                          <TableHead>ID</TableHead>
                          <TableHead>Адрес</TableHead>
                          <TableHead>Клиент</TableHead>
                          <TableHead>Тип котла</TableHead>
                          <TableHead>Статус</TableHead>
                          <TableHead>Прогресс</TableHead>
                          <TableHead>Дата</TableHead>
                          <TableHead>Действия</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredData.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <input
                                type="checkbox"
                                checked={selectedIds.has(item.id)}
                                onChange={() => toggleSelectItem(item.id)}
                                className="rounded border-gray-300"
                              />
                            </TableCell>
                            <TableCell className="font-medium">{item.id}</TableCell>
                            <TableCell>{item.address}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback>
                                    {item.client.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="text-sm font-medium">{item.client.fullName}</div>
                                  <div className="text-xs text-muted-foreground">{item.client.phone}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">{item.boilerType}</div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" className={`${getStatusColor(item.status)} text-white`}>
                                {getStatusText(item.status)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Progress value={item.progress} className="w-16 h-2" />
                                <span className="text-sm text-muted-foreground">{item.progress}%</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {item.type === 'existing' && item.lastService ? (
                                <div>
                                  <div className="text-xs text-muted-foreground">Посл. ТО:</div>
                                  <div className="text-sm">{item.lastService}</div>
                                  {item.temp !== undefined && (
                                    <div className="text-xs text-muted-foreground">{item.temp}°C</div>
                                  )}
                                </div>
                              ) : (
                                <div>
                                  <div className="text-xs text-muted-foreground">План:</div>
                                  <div className="text-sm">{item.plannedDate}</div>
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => setSelectedInstallation(item)}
                                    >
                                      <Icon name="Eye" size={14} className="mr-1" />
                                      Детали
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                    <DialogHeader>
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <DialogTitle>Детали объекта {item.id}</DialogTitle>
                                          <DialogDescription>
                                            Полная информация о клиенте, котле и документах
                                          </DialogDescription>
                                        </div>
                                        <div className="flex space-x-2">
                                          {!isEditing ? (
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              onClick={() => startEditing(selectedInstallation)}
                                            >
                                              <Icon name="Edit" size={14} className="mr-1" />
                                              Редактировать
                                            </Button>
                                          ) : (
                                            <>
                                              <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={cancelEditing}
                                              >
                                                <Icon name="X" size={14} className="mr-1" />
                                                Отмена
                                              </Button>
                                              <Button
                                                size="sm"
                                                onClick={saveChanges}
                                              >
                                                <Icon name="Check" size={14} className="mr-1" />
                                                Сохранить
                                              </Button>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                    </DialogHeader>
                                    
                                    {selectedInstallation && (
                                      <div className="grid grid-cols-1 gap-6">
                                        {/* Основная информация о клиенте */}
                                        <Card>
                                          <CardHeader>
                                            <CardTitle className="text-lg">Информация о клиенте</CardTitle>
                                          </CardHeader>
                                          <CardContent className="space-y-4">
                                            <div className="flex items-center space-x-4">
                                              <Avatar className="h-12 w-12">
                                                <AvatarFallback className="text-lg">
                                                  {selectedInstallation.client.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                                </AvatarFallback>
                                              </Avatar>
                                              <div>
                                                <h3 className="font-medium">{selectedInstallation.client.fullName}</h3>
                                                <p className="text-sm text-muted-foreground">{selectedInstallation.address}</p>
                                              </div>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                              <EditableField label="Основной телефон" path="client.phone" />
                                              <EditableField label="Дополнительный телефон" path="client.additionalPhone" />
                                              <EditableField label="Email" path="client.email" type="email" />
                                              <EditableField label="Паспорт" path="client.passport" />
                                              <EditableField label="ИНН" path="client.inn" />
                                              <EditableField label="Согласие получено" path="client.agreement" type="boolean" />
                                            </div>
                                          </CardContent>
                                        </Card>

                                        {/* Адресная информация */}
                                        <Card>
                                          <CardHeader>
                                            <CardTitle className="text-lg">Адресная информация</CardTitle>
                                          </CardHeader>
                                          <CardContent>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                              <EditableField label="Регион" path="client.region" />
                                              <EditableField label="Населенный пункт" path="client.city" />
                                              <EditableField label="Район" path="client.district" />
                                              <EditableField label="Улица" path="client.street" />
                                              <EditableField label="Дом" path="client.house" />
                                              <EditableField label="Кадастровый номер" path="client.cadastralNumber" />
                                            </div>
                                          </CardContent>
                                        </Card>

                                        {/* Техническая информация о доме */}
                                        <Card>
                                          <CardHeader>
                                            <CardTitle className="text-lg">Характеристики дома</CardTitle>
                                          </CardHeader>
                                          <CardContent>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                              <EditableField label="Год постройки до 2018" path="client.houseBuiltBefore2018" type="boolean" />
                                              <EditableField label="Этажность" path="client.floors" type="number" />
                                              <EditableField 
                                                label="Материал стен" 
                                                path="client.houseWallMaterial"
                                                options={[
                                                  {value: "brick", label: "Кирпич"},
                                                  {value: "concrete", label: "Бетон"},
                                                  {value: "wood", label: "Дерево"},
                                                  {value: "panel", label: "Панель"}
                                                ]}
                                              />
                                              <EditableField label="Фактическая площадь (м²)" path="client.actualHouseArea" type="number" />
                                              <EditableField label="Обогреваемая площадь (м²)" path="client.heatedArea" type="number" />
                                              <EditableField label="Высота потолков (м)" path="client.houseCeilingHeight" type="number" />
                                              <EditableField label="Количество собственников" path="client.ownersCount" type="number" />
                                              <EditableField label="Дата ввода в эксплуатацию" path="client.houseCommissioningDate" type="date" />
                                              <EditableField 
                                                label="Остекление" 
                                                path="client.glazing"
                                                options={[
                                                  {value: "single", label: "Одинарное"},
                                                  {value: "double", label: "Двойное"},
                                                  {value: "triple", label: "Тройное"}
                                                ]}
                                              />
                                              <EditableField label="Площадь остекления (м²)" path="client.glazingArea" type="number" />
                                              <EditableField label="Витражное остекление" path="client.panoramicGlazing" type="boolean" />
                                              <EditableField label="Наличие утеплителя" path="client.insulation" type="boolean" />
                                            </div>
                                          </CardContent>
                                        </Card>

                                        {/* Котельная */}
                                        <Card>
                                          <CardHeader>
                                            <CardTitle className="text-lg">Котельное помещение</CardTitle>
                                          </CardHeader>
                                          <CardContent>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                              <div>
                                                <Label className="text-sm font-medium">Отдельное котельное помещение</Label>
                                                <Input value={selectedInstallation.client.separateBoilerRoom ? 'Да' : 'Нет'} readOnly />
                                              </div>
                                              <div>
                                                <Label className="text-sm font-medium">Расположение котельной</Label>
                                                <Input value={selectedInstallation.client.boilerRoomLocation || '-'} readOnly />
                                              </div>
                                              <div>
                                                <Label className="text-sm font-medium">Длина помещения (м)</Label>
                                                <Input value={selectedInstallation.client.roomLength || '-'} readOnly />
                                              </div>
                                              <div>
                                                <Label className="text-sm font-medium">Ширина помещения (м)</Label>
                                                <Input value={selectedInstallation.client.roomWidth || '-'} readOnly />
                                              </div>
                                              <div>
                                                <Label className="text-sm font-medium">Площадь помещения (м²)</Label>
                                                <Input value={selectedInstallation.client.roomArea || '-'} readOnly />
                                              </div>
                                              <div>
                                                <Label className="text-sm font-medium">Высота потолка (м)</Label>
                                                <Input value={selectedInstallation.client.ceilingHeight || '-'} readOnly />
                                              </div>
                                              <div>
                                                <Label className="text-sm font-medium">Материал стен</Label>
                                                <Input value={selectedInstallation.client.boilerRoomWallMaterial || '-'} readOnly />
                                              </div>
                                              <div>
                                                <Label className="text-sm font-medium">Материал потолка</Label>
                                                <Input value={selectedInstallation.client.boilerRoomCeilingMaterial || '-'} readOnly />
                                              </div>
                                              <div>
                                                <Label className="text-sm font-medium">Материал пола</Label>
                                                <Input value={selectedInstallation.client.boilerRoomFloorMaterial || '-'} readOnly />
                                              </div>
                                              <div>
                                                <Label className="text-sm font-medium">Окна в котельной</Label>
                                                <Input value={selectedInstallation.client.windowsInBoilerRoom ? 'Да' : 'Нет'} readOnly />
                                              </div>
                                              <div>
                                                <Label className="text-sm font-medium">Двери в котельной</Label>
                                                <Input value={selectedInstallation.client.doorsInBoilerRoom ? 'Да' : 'Нет'} readOnly />
                                              </div>
                                              <div>
                                                <Label className="text-sm font-medium">Приточная вентиляция</Label>
                                                <Input value={selectedInstallation.client.supplyVentilation ? 'Да' : 'Нет'} readOnly />
                                              </div>
                                              <div>
                                                <Label className="text-sm font-medium">Пожарная сигнализация</Label>
                                                <Input value={selectedInstallation.client.fireAlarmAndSensor ? 'Да' : 'Нет'} readOnly />
                                              </div>
                                            </div>
                                          </CardContent>
                                        </Card>

                                        {/* Оборудование и подключения */}
                                        <Card>
                                          <CardHeader>
                                            <CardTitle className="text-lg">Котел и подключения</CardTitle>
                                          </CardHeader>
                                          <CardContent>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                              <div>
                                                <Label className="text-sm font-medium">Марка и модель котла</Label>
                                                <Input value={selectedInstallation.client.boilerBrandModel || selectedInstallation.boilerType} readOnly />
                                              </div>
                                              <div>
                                                <Label className="text-sm font-medium">Номинальная мощность (кВт)</Label>
                                                <Input value={selectedInstallation.client.nominalPower || '-'} readOnly />
                                              </div>
                                              <div>
                                                <Label className="text-sm font-medium">Точка подключения 220В</Label>
                                                <Input value={selectedInstallation.client.power220Point || '-'} readOnly />
                                              </div>
                                              <div>
                                                <Label className="text-sm font-medium">Расстояние до 220В (м)</Label>
                                                <Input value={selectedInstallation.client.distanceTo220 || '-'} readOnly />
                                              </div>
                                              <div>
                                                <Label className="text-sm font-medium">Контуров на выходе</Label>
                                                <Input value={selectedInstallation.client.outputCircuits || '-'} readOnly />
                                              </div>
                                              <div>
                                                <Label className="text-sm font-medium">Циркуляционный насос</Label>
                                                <Input value={selectedInstallation.client.circulationPump ? 'Да' : 'Нет'} readOnly />
                                              </div>
                                              <div>
                                                <Label className="text-sm font-medium">Подключение к ХВС</Label>
                                                <Input value={selectedInstallation.client.coldWaterConnection || '-'} readOnly />
                                              </div>
                                              <div>
                                                <Label className="text-sm font-medium">Расстояние до ХВС (м)</Label>
                                                <Input value={selectedInstallation.client.distanceToColdWater || '-'} readOnly />
                                              </div>
                                              <div>
                                                <Label className="text-sm font-medium">Диаметр подкл. трубопровода (мм)</Label>
                                                <Input value={selectedInstallation.client.pipeConnectionDiameter || '-'} readOnly />
                                              </div>
                                              <div>
                                                <Label className="text-sm font-medium">Метод закачки теплоносителя</Label>
                                                <Input value={selectedInstallation.client.coolantFillingMethod || '-'} readOnly />
                                              </div>
                                            </div>
                                          </CardContent>
                                        </Card>

                                        {/* Дымоход */}
                                        <Card>
                                          <CardHeader>
                                            <CardTitle className="text-lg">Дымоход</CardTitle>
                                          </CardHeader>
                                          <CardContent>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                              <div>
                                                <Label className="text-sm font-medium">Тип дымохода</Label>
                                                <Input value={selectedInstallation.client.chimneyType || '-'} readOnly />
                                              </div>
                                              <div>
                                                <Label className="text-sm font-medium">Диаметр на выходе (мм)</Label>
                                                <Input value={selectedInstallation.client.chimneyDiameter || '-'} readOnly />
                                              </div>
                                              <div>
                                                <Label className="text-sm font-medium">Количество колен</Label>
                                                <Input value={selectedInstallation.client.chimneyElbows || '-'} readOnly />
                                              </div>
                                              <div>
                                                <Label className="text-sm font-medium">Длина дымохода (м)</Label>
                                                <Input value={selectedInstallation.client.chimneyLength || '-'} readOnly />
                                              </div>
                                            </div>
                                          </CardContent>
                                        </Card>

                                        {/* Статусы и комментарии */}
                                        <Card>
                                          <CardHeader>
                                            <CardTitle className="text-lg">Статусы работ</CardTitle>
                                          </CardHeader>
                                          <CardContent>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                              <div>
                                                <Label className="text-sm font-medium">Статус обходчиков</Label>
                                                <Input value={selectedInstallation.client.surveyorStatus || '-'} readOnly />
                                              </div>
                                              <div>
                                                <Label className="text-sm font-medium">Статус визита</Label>
                                                <Input value={selectedInstallation.client.visitStatus || '-'} readOnly />
                                              </div>
                                              <div>
                                                <Label className="text-sm font-medium">Планируемая дата визита</Label>
                                                <Input value={selectedInstallation.client.plannedSurveyDate || '-'} readOnly />
                                              </div>
                                              <div>
                                                <Label className="text-sm font-medium">Фактическая дата визита</Label>
                                                <Input value={selectedInstallation.client.actualSurveyDate || '-'} readOnly />
                                              </div>
                                              <div>
                                                <Label className="text-sm font-medium">Дата создания заявки</Label>
                                                <Input value={selectedInstallation.client.applicationCreatedDate || selectedInstallation.orderDate} readOnly />
                                              </div>
                                              <div>
                                                <Label className="text-sm font-medium">Дата заполнения</Label>
                                                <Input value={selectedInstallation.client.fillingDate || '-'} readOnly />
                                              </div>
                                            </div>
                                            
                                            <div className="mt-4 space-y-3">
                                              <EditableField label="Комментарий к заявке" path="client.applicationComment" isTextarea={true} />
                                              <EditableField label="Комментарий обходчиков" path="client.surveyorComment" isTextarea={true} />
                                              <EditableField label="Ссылка на Яндекс диск" path="client.yandexDiskLink" />
                                            </div>
                                          </CardContent>
                                        </Card>

                                        {/* Информация о заказе */}
                                        <Card>
                                          <CardHeader>
                                            <CardTitle className="text-lg">Детали заказа</CardTitle>
                                          </CardHeader>
                                          <CardContent className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                              <EditableField label="Тип котла" path="boilerType" />
                                              <EditableField label="Дата заказа" path="orderDate" type="date" />
                                              <EditableField label="Планируемая дата" path="plannedDate" type="date" />
                                              
                                              <EditableField 
                                                label="Статус заявки" 
                                                path="status" 
                                                options={[
                                                  {value: "new", label: "Новая"},
                                                  {value: "pending", label: "В ожидании"},
                                                  {value: "approved", label: "Одобрена"},
                                                  {value: "in_progress", label: "В работе"},
                                                  {value: "completed", label: "Завершена"},
                                                  {value: "cancelled", label: "Отменена"}
                                                ]}
                                              />
                                              
                                              <EditableField 
                                                label="Завершение работы КЦ" 
                                                path="client.workCompletionStatus"
                                                options={[
                                                  {value: "pending", label: "В ожидании"},
                                                  {value: "in_progress", label: "В работе"},
                                                  {value: "completed", label: "Завершена"}
                                                ]}
                                              />
                                              
                                              <EditableField 
                                                label="Готовность к переводу" 
                                                path="client.ownersReadiness"
                                                options={[
                                                  {value: "not_ready", label: "Не готов"},
                                                  {value: "ready", label: "Готов"},
                                                  {value: "in_process", label: "В процессе"}
                                                ]}
                                              />
                                              
                                              <EditableField label="Год перевода на эко-отопление" path="client.ecoHeatingYear" type="number" />
                                              
                                              <EditableField 
                                                label="Вид перевода" 
                                                path="client.conversionType"
                                                options={[
                                                  {value: "gas", label: "Газ"},
                                                  {value: "electric", label: "Электричество"},
                                                  {value: "solid_fuel", label: "Твердое топливо"}
                                                ]}
                                              />
                                              
                                              <EditableField 
                                                label="Вид АИТ" 
                                                path="client.aitType"
                                                options={[
                                                  {value: "individual", label: "Индивидуальный"},
                                                  {value: "collective", label: "Коллективный"}
                                                ]}
                                              />
                                              
                                              <EditableField 
                                                label="Вид топлива" 
                                                path="client.fuelType"
                                                options={[
                                                  {value: "natural_gas", label: "Природный газ"},
                                                  {value: "lpg", label: "Сжиженный газ"},
                                                  {value: "electricity", label: "Электричество"},
                                                  {value: "solid_fuel", label: "Твердое топливо"}
                                                ]}
                                              />
                                              
                                              <EditableField 
                                                label="Система отопления" 
                                                path="client.heatingSystem"
                                                options={[
                                                  {value: "radiator", label: "Радиаторная"},
                                                  {value: "floor", label: "Теплый пол"},
                                                  {value: "combined", label: "Комбинированная"}
                                                ]}
                                              />
                                              
                                              <EditableField 
                                                label="Тип системы отопления" 
                                                path="client.heatingSystemType"
                                                options={[
                                                  {value: "open", label: "Открытая"},
                                                  {value: "closed", label: "Закрытая"}
                                                ]}
                                              />
                                            </div>
                                            
                                            <div className="mt-4">
                                              <Label className="text-sm font-medium">Прогресс: {selectedInstallation.progress}%</Label>
                                              <Progress value={selectedInstallation.progress} className="mt-2" />
                                            </div>
                                          </CardContent>
                                        </Card>

                                        {/* Документы */}
                                        <Card>
                                          <CardHeader>
                                            <CardTitle className="text-lg">Документы</CardTitle>
                                          </CardHeader>
                                          <CardContent>
                                            <div className="space-y-3">
                                              {selectedInstallation.documents.map((doc, index) => (
                                                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                                  <div className="flex items-center space-x-2">
                                                    <Icon name="FileText" size={16} className="text-blue-500" />
                                                    <span className="text-sm">{doc}</span>
                                                  </div>
                                                  <div className="flex space-x-2">
                                                    <Button variant="outline" size="sm">
                                                      <Icon name="Download" size={14} className="mr-1" />
                                                      Скачать
                                                    </Button>
                                                    <Button variant="outline" size="sm">
                                                      <Icon name="Eye" size={14} className="mr-1" />
                                                      Просмотр
                                                    </Button>
                                                  </div>
                                                </div>
                                              ))}
                                              
                                              <Button variant="outline" className="w-full">
                                                <Icon name="Plus" size={16} className="mr-2" />
                                                Добавить документ
                                              </Button>
                                            </div>
                                          </CardContent>
                                        </Card>

                                        {/* Фотографии */}
                                        <Card>
                                          <CardHeader>
                                            <CardTitle className="text-lg">Фотографии</CardTitle>
                                          </CardHeader>
                                          <CardContent>
                                            <div className="space-y-4">
                                              <div>
                                                <h4 className="font-medium mb-2">До установки</h4>
                                                <div className="grid grid-cols-2 gap-2">
                                                  {selectedInstallation.photos
                                                    .filter(photo => photo.includes('before'))
                                                    .map((photo, index) => (
                                                    <div key={index} className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                                                      <Icon name="Image" size={24} className="text-muted-foreground" />
                                                    </div>
                                                  ))}
                                                  <Button variant="outline" className="aspect-square">
                                                    <Icon name="Plus" size={16} />
                                                  </Button>
                                                </div>
                                              </div>
                                              
                                              <div>
                                                <h4 className="font-medium mb-2">Процесс установки</h4>
                                                <div className="grid grid-cols-2 gap-2">
                                                  {selectedInstallation.photos
                                                    .filter(photo => photo.includes('installation'))
                                                    .map((photo, index) => (
                                                    <div key={index} className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                                                      <Icon name="Image" size={24} className="text-muted-foreground" />
                                                    </div>
                                                  ))}
                                                  <Button variant="outline" className="aspect-square">
                                                    <Icon name="Plus" size={16} />
                                                  </Button>
                                                </div>
                                              </div>
                                              
                                              <div>
                                                <h4 className="font-medium mb-2">После установки</h4>
                                                <div className="grid grid-cols-2 gap-2">
                                                  {selectedInstallation.photos
                                                    .filter(photo => photo.includes('completed'))
                                                    .map((photo, index) => (
                                                    <div key={index} className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                                                      <Icon name="Image" size={24} className="text-muted-foreground" />
                                                    </div>
                                                  ))}
                                                  <Button variant="outline" className="aspect-square">
                                                    <Icon name="Plus" size={16} />
                                                  </Button>
                                                </div>
                                              </div>
                                            </div>
                                          </CardContent>
                                        </Card>
                                      </div>
                                    )}
                                  </DialogContent>
                                </Dialog>
                                
                                <Button variant="outline" size="sm">
                                  <Icon name="Edit" size={14} className="mr-1" />
                                  Изменить
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="calendar" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Календарь установок</CardTitle>
                      <CardDescription>Планирование новых установок котлов</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md border"
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Запланированные работы</CardTitle>
                      <CardDescription>Ближайшие установки и обслуживание</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3 p-3 border rounded-lg">
                          <Icon name="Calendar" size={16} className="text-primary" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">Установка котла</p>
                            <p className="text-xs text-muted-foreground">ул. Новая, 25 • 25 сентября</p>
                          </div>
                          <Badge>Запланировано</Badge>
                        </div>
                        
                        <div className="flex items-center space-x-3 p-3 border rounded-lg">
                          <Icon name="Wrench" size={16} className="text-blue-500" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">ТО котла BLR-001</p>
                            <p className="text-xs text-muted-foreground">ул. Ленина, 15 • 28 сентября</p>
                          </div>
                          <Badge variant="secondary">Обслуживание</Badge>
                        </div>
                        
                        <div className="flex items-center space-x-3 p-3 border rounded-lg">
                          <Icon name="AlertCircle" size={16} className="text-yellow-500" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">Проверка BLR-005</p>
                            <p className="text-xs text-muted-foreground">ул. Советская, 12 • 30 сентября</p>
                          </div>
                          <Badge variant="outline">Срочно</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="map" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Карта установок котлов</CardTitle>
                    <CardDescription>Географическое расположение всех котлов в системе</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative bg-muted rounded-lg p-8 h-96 flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <Icon name="Map" size={48} className="text-muted-foreground mx-auto" />
                        <div>
                          <h3 className="font-medium">Интерактивная карта</h3>
                          <p className="text-sm text-muted-foreground">
                            Здесь будет отображаться карта с метками всех установленных котлов
                          </p>
                        </div>
                        <Button className="mt-4">
                          <Icon name="MapPin" size={16} className="mr-2" />
                          Показать все установки
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}