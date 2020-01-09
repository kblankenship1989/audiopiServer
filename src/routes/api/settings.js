import { Router } from 'express';
import { settings, updateSetting } from '../../services/settings';

var settingsRouter = Router();

settingsRouter.get('/', function(req, res, next) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(settings);
})
.post('/', function(req, res, next) {
    try{
        const newSettings = req.body;
        
        Object.keys(newSettings).forEach((key) => {
            updateSetting(key, newSettings[key]);
        });
    } catch (err) {
        next(err);
    }
    res.status = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end(`Successfully updated all settings`);
})
.put('/:setting', function(req, res, next) {
    try {
        const setting = req.params.setting;
        const newValue = req.query.value;

        updateSetting(setting, newValue, () => {
            res.status = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.end(`Successfully updated SETTING: ${setting} to VALUE: ${newValue}`);
        })
    } catch (err) {
        next(err);
    }
});

export default settingsRouter;
