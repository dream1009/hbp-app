import { formatTime } from '@/filters/index'
import { getStatus } from '@/mixins/bpmnStatus'

const instStr = JSON.stringify([
  {key: "field0", style: {}, field: {name: 'id', field_options: {}}},
  {key: "field1", style: {}, field: {name: 'procDefName', field_options: {}}},
  {key: "field2", style: {}, field: {name: 'createTime', field_options: {}}},
  {key: "field3", style: {}, field: {name: 'bpmInstPo', field_options: {}}},
]);

const taskStr = JSON.stringify([
  {key: "field0", style: {}, field: {name: 'id', field_options: {}}},
  {key: "field1", style: {}, field: {name: 'name', field_options: {}}},
  {key: "field2", style: {}, field: {name: 'createTime', field_options: {}}},
  {key: "field3", style: {}, field: {name: 'bpmTaskPo', field_options: {}}},
]);

export function getCustomData(listData, para) {
  const key = para === 'task' ? 'bpmTaskPo' : 'bpmInstPo';
  const jsonStr = para === 'task' ? taskStr : instStr;
  return {
    ...listData,
    dataResult: listData.dataResult.map(item => {
      const ext = item[key];
      const appView = JSON.parse(item['appView'] || jsonStr);
      Object.assign(item, {key, id: ext.id, title: ext.procDefName});
      return appView.reduce((a, b) => {
        const key = (b.field || {}).name;
        let object = item.object
        if (para === 'task' && object) {
          object = Object.assign(object, {bizTaskId: item.bpmTaskPo.taskId})
        }
        return Object.assign(a, {[b.key]: { key, data: object || ext, style: b.style, field: b.field }});
      }, item);
    })
  };
}
